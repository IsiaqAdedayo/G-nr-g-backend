import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { MatchingService, type MatchOutcome } from './matching.service.js';

@Injectable()
export class LikenessService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly matching: MatchingService,
  ) {}

  /**
   * POST /likeness/match — Run model matching against user's body + appearance.
   * Persists the result as the user's active likeness.
   */
  async matchAndPersist(userId: string, skinTone?: string): Promise<MatchOutcome> {
    // Get user's body and appearance profiles
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: { body: true, appearance: true },
    });

    if (!profile?.body) {
      throw new NotFoundException('Body measurements not found. Create your profile first.');
    }

    // Run matching algorithm (§3)
    const outcome = await this.matching.match(
      profile.body,
      skinTone ? { ...profile.appearance, skinTone } as any : profile.appearance,
    );

    // Persist likeness (upsert — one likeness per user per §22)
    const existing = await this.prisma.virtualLikeness.findUnique({
      where: { userId },
    });

    const data = {
      userId,
      matchedModelId: outcome.matchedModel.id,
      matchDistance: outcome.matchDistance,
      matchConfidenceTier: outcome.matchConfidenceTier,
      heightCm: profile.body.heightCm,
      bustCm: profile.body.bustCm,
      waistCm: profile.body.waistCm,
      hipsCm: profile.body.hipsCm,
      shoulderCm: profile.body.shoulderCm,
      inseamCm: profile.body.inseamCm,
      skinTone: profile.appearance?.skinTone ?? '#C8956C',
      hairColour: profile.appearance?.hairColour ?? 'black',
      ageRange: profile.appearance?.ageRange ?? '26-35',
      build: profile.appearance?.build ?? 'average',
    };

    if (existing) {
      await this.prisma.virtualLikeness.update({
        where: { userId },
        data,
      });
    } else {
      await this.prisma.virtualLikeness.create({ data });
    }

    return outcome;
  }

  /**
   * GET /likeness — Get the user's active likeness.
   */
  async get(userId: string) {
    const likeness = await this.prisma.virtualLikeness.findUnique({
      where: { userId },
      include: { matchedModel: true },
    });

    if (!likeness) {
      throw new NotFoundException('No likeness found. Create your likeness first.');
    }

    return likeness;
  }

  /**
   * PATCH /likeness — Update likeness (e.g. adjust match).
   */
  async update(userId: string, data: { matchedModelId?: string }) {
    const likeness = await this.prisma.virtualLikeness.findUnique({
      where: { userId },
    });

    if (!likeness) {
      throw new NotFoundException('No likeness found.');
    }

    return this.prisma.virtualLikeness.update({
      where: { userId },
      data,
      include: { matchedModel: true },
    });
  }
}
