import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { ModelPreset, BodyProfile, AppearanceProfile } from '@prisma/client';

// ── Weights per spec §3 ────────────────────────────────────────────────────
const WEIGHTS = {
  bust: 1.2,
  waist: 1.2,
  hips: 1.2,
  height: 0.8,
  shoulder: 0.6,
} as const;

// ── Confidence tier thresholds (§3) ────────────────────────────────────────
function getConfidenceTier(distance: number): 'close' | 'moderate' | 'loose' {
  if (distance < 0.15) return 'close';
  if (distance < 0.35) return 'moderate';
  return 'loose';
}

// ── Luminance-based skin-tone grouping ─────────────────────────────────────
function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function skinToneSimilarity(userTone: string, modelTone: string): boolean {
  return Math.abs(luminance(userTone) - luminance(modelTone)) < 80;
}

// ── Range structure for normalisation ──────────────────────────────────────
interface RangeSet {
  heightRange: number;
  bustRange: number;
  waistRange: number;
  hipsRange: number;
  shoulderRange: number;
}

function computeRanges(models: ModelPreset[]): RangeSet {
  const heights = models.map((m) => m.heightCm);
  const busts = models.map((m) => m.bustCm);
  const waists = models.map((m) => m.waistCm);
  const hips = models.map((m) => m.hipsCm);
  const shoulders = models.map((m) => m.shoulderCm);

  return {
    heightRange: Math.max(...heights) - Math.min(...heights),
    bustRange: Math.max(...busts) - Math.min(...busts),
    waistRange: Math.max(...waists) - Math.min(...waists),
    hipsRange: Math.max(...hips) - Math.min(...hips),
    shoulderRange: Math.max(...shoulders) - Math.min(...shoulders),
  };
}

// ── Distance calculation per spec §3 Step 1 ───────────────────────────────
function measurementDistance(
  user: { heightCm: number; bustCm: number; waistCm: number; hipsCm: number; shoulderCm?: number | null },
  model: ModelPreset,
  ranges: RangeSet,
): number {
  const terms: number[] = [];

  terms.push(WEIGHTS.bust * ((user.bustCm - model.bustCm) / ranges.bustRange) ** 2);
  terms.push(WEIGHTS.waist * ((user.waistCm - model.waistCm) / ranges.waistRange) ** 2);
  terms.push(WEIGHTS.hips * ((user.hipsCm - model.hipsCm) / ranges.hipsRange) ** 2);
  terms.push(WEIGHTS.height * ((user.heightCm - model.heightCm) / ranges.heightRange) ** 2);

  if (user.shoulderCm != null) {
    terms.push(
      WEIGHTS.shoulder * ((user.shoulderCm - model.shoulderCm) / ranges.shoulderRange) ** 2,
    );
  }

  return Math.sqrt(terms.reduce((a, b) => a + b, 0));
}

// ── Public types ──────────────────────────────────────────────────────────
export interface MatchResult {
  model: ModelPreset;
  distance: number;
  confidenceTier: 'close' | 'moderate' | 'loose';
  rank: number;
}

export interface MatchOutcome {
  matchedModel: ModelPreset;
  matchDistance: number;
  matchConfidenceTier: 'close' | 'moderate' | 'loose';
  topCandidates: MatchResult[];
}

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find the closest model preset for a given measurement + appearance profile.
   * §3 — Steps 1–3.
   */
  async match(body: BodyProfile, appearance?: AppearanceProfile | null): Promise<MatchOutcome> {
    // Load all model presets
    const allModels = await this.prisma.modelPreset.findMany();

    if (allModels.length === 0) {
      throw new Error('No model presets in database — run seed first');
    }

    const ranges = computeRanges(allModels);

    // Step 2 — Categorical filter: skin tone similarity
    let candidates = allModels;
    if (appearance?.skinTone) {
      const filtered = allModels.filter((m) => skinToneSimilarity(appearance.skinTone, m.skinTone));
      if (filtered.length >= 3) {
        candidates = filtered;
      }
    }

    // Step 1 — Compute distances and rank
    const ranked = candidates
      .map((model) => ({
        model,
        distance: measurementDistance(body, model, ranges),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5) // Step 3 — top 5
      .map((r, idx) => ({
        ...r,
        confidenceTier: getConfidenceTier(r.distance),
        rank: idx + 1,
      })) as MatchResult[];

    const best = ranked[0];

    this.logger.log(
      `Matched model "${best.model.name}" (distance: ${best.distance.toFixed(4)}, tier: ${best.confidenceTier})`,
    );

    return {
      matchedModel: best.model,
      matchDistance: best.distance,
      matchConfidenceTier: best.confidenceTier,
      topCandidates: ranked,
    };
  }
}
