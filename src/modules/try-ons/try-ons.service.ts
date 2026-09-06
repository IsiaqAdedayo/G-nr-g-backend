import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateTryOnDto } from '../../common/dto/try-on.dto.js';
import { createHash } from 'node:crypto';

// §27 — Caching input signature versions
const AI_MODEL_VERSION = 'v1';
const RENDER_CONFIG_VERSION = 'v1';

function computeInputSignature(likenessId: string, garmentId: string): string {
  const raw = `${likenessId}:${garmentId}:${AI_MODEL_VERSION}:${RENDER_CONFIG_VERSION}`;
  return createHash('sha256').update(raw).digest('hex').slice(0, 32);
}

@Injectable()
export class TryOnsService {
  private readonly logger = new Logger(TryOnsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('try-on-generation') private readonly tryOnQueue: Queue,
  ) {}

  /**
   * POST /try-ons — Create a try-on job.
   * §6.1 — Idempotent per (likenessVersion, garmentVersion, aiModelVersion).
   * §27 — Caches completed results by input signature.
   */
  async create(userId: string, dto: CreateTryOnDto) {
    // Validate likeness exists
    const likeness = await this.prisma.virtualLikeness.findUnique({
      where: { userId },
    });
    if (!likeness) {
      throw new BadRequestException('No likeness found. Create your likeness first.');
    }

    // Validate garment exists
    const garment = await this.prisma.garment.findUnique({
      where: { id: dto.garmentId },
    });
    if (!garment) {
      throw new NotFoundException(`Garment ${dto.garmentId} not found`);
    }

    const inputSignature = computeInputSignature(likeness.id, garment.id);

    // §6.1 — Check for duplicate in-flight or completed job
    const existing = await this.prisma.tryOn.findUnique({
      where: { inputSignature },
    });

    if (existing) {
      if (existing.status === 'completed' || existing.status === 'processing' || existing.status === 'queued') {
        this.logger.log(`Returning existing try-on ${existing.id} (status: ${existing.status})`);
        return existing;
      }
      // If previous was failed, allow retry — delete and recreate
      if (existing.status === 'failed') {
        await this.prisma.tryOn.delete({ where: { id: existing.id } });
      }
    }

    // §25.1 — Rate limiting check (token bucket: 20 per rolling hour per user)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await this.prisma.tryOn.count({
      where: {
        userId,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recentCount >= 20) {
      throw new BadRequestException(
        'You\'ve hit your try-on limit for now. Please try again later.',
      );
    }

    // Create job
    const tryOn = await this.prisma.tryOn.create({
      data: {
        userId,
        likenessId: likeness.id,
        garmentId: garment.id,
        inputSignature,
        status: 'queued',
      },
      include: { garment: true, likeness: { include: { matchedModel: true } } },
    });

    // Enqueue background job (§7)
    await this.tryOnQueue.add(
      'generate',
      {
        tryOnId: tryOn.id,
        userId,
        likenessId: likeness.id,
        garmentId: garment.id,
      },
      {
        jobId: tryOn.id,
        attempts: 2,
        backoff: { type: 'exponential', delay: 5000 },
      },
    );

    this.logger.log(`Queued try-on job ${tryOn.id} for user ${userId}`);
    return tryOn;
  }

  /**
   * GET /try-ons/:id — Get try-on result.
   */
  async findOne(id: string, userId: string) {
    const tryOn = await this.prisma.tryOn.findFirst({
      where: { id, userId },
      include: {
        garment: true,
        likeness: { include: { matchedModel: true } },
        fitAnalysis: true,
      },
    });

    if (!tryOn) throw new NotFoundException(`Try-on ${id} not found`);
    return tryOn;
  }

  /**
   * GET /try-ons/:id/status — Lightweight status check for polling (§6.1).
   */
  async getStatus(id: string, userId: string) {
    const tryOn = await this.prisma.tryOn.findFirst({
      where: { id, userId },
      select: {
        id: true,
        status: true,
        resultUrl: true,
        error: true,
        createdAt: true,
        completedAt: true,
      },
    });

    if (!tryOn) throw new NotFoundException(`Try-on ${id} not found`);
    return tryOn;
  }
}
