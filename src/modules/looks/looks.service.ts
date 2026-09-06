import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateLookDto } from '../../common/dto/look.dto.js';

@Injectable()
export class LooksService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * POST /looks — Save a completed try-on as a Look.
   * §11 — A Look contains: virtualLikeness, garment, tryOnResult, fitAnalysis, createdAt.
   */
  async create(userId: string, dto: CreateLookDto) {
    const tryOn = await this.prisma.tryOn.findFirst({
      where: { id: dto.tryOnId, userId, status: 'completed' },
      include: {
        likeness: true,
        garment: true,
        fitAnalysis: true,
      },
    });

    if (!tryOn) {
      throw new NotFoundException('Completed try-on not found');
    }

    // §11 — Check for duplicate (same garment + same likeness)
    const existing = await this.prisma.look.findUnique({
      where: {
        likenessId_garmentId: {
          likenessId: tryOn.likenessId,
          garmentId: tryOn.garmentId,
        },
      },
    });

    if (existing) {
      // Update existing look
      return this.prisma.look.update({
        where: { id: existing.id },
        data: {
          tryOnId: tryOn.id,
          resultImg: tryOn.resultUrl,
        },
        include: {
          garment: true,
          likeness: { include: { matchedModel: true } },
        },
      });
    }

    return this.prisma.look.create({
      data: {
        userId,
        likenessId: tryOn.likenessId,
        garmentId: tryOn.garmentId,
        tryOnId: tryOn.id,
        resultImg: tryOn.resultUrl,
      },
      include: {
        garment: true,
        likeness: { include: { matchedModel: true } },
      },
    });
  }

  /**
   * GET /looks — List all saved looks.
   */
  async findAll(userId: string) {
    return this.prisma.look.findMany({
      where: { userId },
      include: {
        garment: true,
        likeness: { include: { matchedModel: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * DELETE /looks/:id — Remove a saved look.
   */
  async remove(userId: string, lookId: string) {
    const look = await this.prisma.look.findFirst({
      where: { id: lookId, userId },
    });

    if (!look) throw new NotFoundException('Look not found');

    return this.prisma.look.delete({ where: { id: lookId } });
  }
}
