import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service.js';
import { FitEngineService } from '../fit-analysis/fit-engine.service.js';

interface TryOnJobData {
  tryOnId: string;
  userId: string;
  likenessId: string;
  garmentId: string;
}

@Processor('try-on-generation', { concurrency: 1 })
export class TryOnProcessor extends WorkerHost {
  private readonly logger = new Logger(TryOnProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fitEngine: FitEngineService,
  ) {
    super();
  }

  /**
   * Process a try-on generation job.
   * §6.1 — Validates result before marking completed.
   * §26 — Persists failed jobs for diagnostics.
   */
  async process(job: Job<TryOnJobData>): Promise<any> {
    const { tryOnId } = job.data;

    this.logger.log(`Processing try-on job ${tryOnId}`);

    // Mark as processing
    await this.prisma.tryOn.update({
      where: { id: tryOnId },
      data: { status: 'processing' },
    });

    const startTime = Date.now();

    try {
      // Load the try-on with all relations
      const tryOn = await this.prisma.tryOn.findUnique({
        where: { id: tryOnId },
        include: {
          likeness: { include: { matchedModel: true } },
          garment: true,
        },
      });

      if (!tryOn) throw new Error(`Try-on ${tryOnId} not found`);

      // ── AI Generation ──────────────────────────────────────────────────
      // In MVP, we simulate the AI try-on result by using the garment's
      // fittedImg as a placeholder. In production, this calls the
      // VirtualTryOnProvider abstraction (§6).
      //
      // TODO: Replace with actual AI provider call
      // const result = await this.aiProvider.generateTryOn({...});
      const resultUrl = tryOn.garment.fittedImg || tryOn.garment.images[0] || null;

      // §6.1 — Validate returned asset
      if (!resultUrl) {
        throw new Error('No result image available from provider');
      }

      // Compute fit analysis (§10)
      const fitAnalysis = this.fitEngine.computeFit(
        tryOn.garment,
        tryOn.likeness.matchedModel,
        tryOn.likeness,
        tryOn.likeness.matchConfidenceTier as any,
      );

      // Persist fit analysis
      await this.prisma.fitAnalysis.create({
        data: {
          tryOnId,
          labels: fitAnalysis.labels as any,
          matchConfidenceTier: fitAnalysis.matchConfidenceTier,
          qualifiedMessage: fitAnalysis.qualifiedMessage,
        },
      });

      // Mark as completed
      const latencyMs = Date.now() - startTime;
      await this.prisma.tryOn.update({
        where: { id: tryOnId },
        data: {
          status: 'completed',
          resultUrl,
          latencyMs,
          provider: 'mvp-simulation',
          providerModel: 'placeholder-v1',
          completedAt: new Date(),
        },
      });

      this.logger.log(`Try-on ${tryOnId} completed in ${latencyMs}ms`);
      return { resultUrl };

    } catch (error: any) {
      // §26 — Persist failure for diagnostics
      const latencyMs = Date.now() - startTime;
      await this.prisma.tryOn.update({
        where: { id: tryOnId },
        data: {
          status: 'failed',
          error: error.message || 'Unknown error',
          latencyMs,
          provider: 'mvp-simulation',
        },
      });

      this.logger.error(`Try-on ${tryOnId} failed: ${error.message}`);
      throw error; // Let BullMQ retry
    }
  }
}
