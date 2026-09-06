import { Injectable } from '@nestjs/common';
import type {
  Garment,
  ModelPreset,
  BodyProfile,
  FitAnalysis,
} from '@prisma/client';

type MatchConfidenceTier = 'close' | 'moderate' | 'loose';
import type { TopMeasurements, TrouserMeasurements, DressMeasurements } from './fit-analysis.types.js';

// Local FitLabel type (stored as Json in Prisma) — matches frontend spec §9
interface FitLabel {
  zone: string;
  label: string;
  detail?: string;
  garmentEaseCm: number;
  matchErrorCm: number;
}

// Fit label thresholds in cm — category and stretch aware
interface FitThreshold {
  tight: number;
  close: number;
  roomy: number;
}

function getThresholds(stretch: string, fit: string): FitThreshold {
  const base: FitThreshold = { tight: -2, close: 2, roomy: 5 };

  const stretchMod: Record<string, number> = { none: 0, low: 0.5, medium: 1.5, high: 3 };
  const sm = stretchMod[stretch] ?? 0;

  const fitMod: Record<string, number> = { slim: -1, regular: 0, relaxed: 2, oversized: 5 };
  const fm = fitMod[fit] ?? 0;

  return {
    tight: base.tight + fm,
    close: base.close + sm + fm,
    roomy: base.roomy + sm + fm,
  };
}

function easeCmToLabel(easeCm: number, thresholds: FitThreshold): string {
  if (easeCm < thresholds.tight) return 'Too tight';
  if (easeCm < thresholds.close) return 'Close';
  if (easeCm < thresholds.roomy) return 'Roomy';
  return 'Very roomy';
}

@Injectable()
export class FitEngineService {
  /**
   * Compute fit analysis for a garment on a matched model vs user measurements.
   * §10 — Two-source error model.
   */
  computeFit(
    garment: Garment,
    matchedModel: ModelPreset,
    userMeasurements: Pick<BodyProfile, 'heightCm' | 'bustCm' | 'waistCm' | 'hipsCm' | 'shoulderCm' | 'inseamCm'>,
    matchConfidenceTier: MatchConfidenceTier,
  ): Omit<FitAnalysis, 'id' | 'tryOnId' | 'createdAt'> {
    const thresholds = getThresholds(garment.stretch, garment.fit);
    const labels: FitLabel[] = [];
    const gm = garment.garmentMeasurements as Record<string, any>;

    const category = garment.category;

    if (category === 'Tops' || category === 'Sets' || category === 'Outerwear') {
      const m = gm as TopMeasurements;

      const bustEase = m.bustCm - matchedModel.bustCm;
      const bustMatchErr = matchedModel.bustCm - userMeasurements.bustCm;
      labels.push({
        zone: 'bust',
        label: easeCmToLabel(bustEase, thresholds),
        detail: `Garment bust ${m.bustCm}cm — model ${matchedModel.bustCm}cm`,
        garmentEaseCm: bustEase,
        matchErrorCm: bustMatchErr,
      });

      if (m.shoulderCm) {
        const shEase = m.shoulderCm - matchedModel.shoulderCm;
        const shMatchErr =
          matchedModel.shoulderCm -
          (userMeasurements.shoulderCm ?? matchedModel.shoulderCm);
        labels.push({
          zone: 'shoulders',
          label: easeCmToLabel(shEase, { ...thresholds, roomy: thresholds.roomy - 1 }),
          detail: `Garment shoulder ${m.shoulderCm}cm — model ${matchedModel.shoulderCm}cm`,
          garmentEaseCm: shEase,
          matchErrorCm: shMatchErr,
        });
      }

      labels.push({
        zone: 'length',
        label: m.lengthCm > 70 ? 'Long' : m.lengthCm > 60 ? 'Regular' : 'Cropped',
        detail: `Length ${m.lengthCm}cm`,
        garmentEaseCm: 0,
        matchErrorCm: 0,
      });
    }

    if (category === 'Trousers' || category === 'Jeans') {
      const m = gm as TrouserMeasurements;

      const waistEase = m.waistCm - matchedModel.waistCm;
      const waistMatchErr = matchedModel.waistCm - userMeasurements.waistCm;
      labels.push({
        zone: 'waist',
        label: easeCmToLabel(waistEase, thresholds),
        detail: `Garment waist ${m.waistCm}cm — model ${matchedModel.waistCm}cm`,
        garmentEaseCm: waistEase,
        matchErrorCm: waistMatchErr,
      });

      const hipsEase = m.hipsCm - matchedModel.hipsCm;
      const hipsMatchErr = matchedModel.hipsCm - userMeasurements.hipsCm;
      labels.push({
        zone: 'hips',
        label: easeCmToLabel(hipsEase, thresholds),
        detail: `Garment hips ${m.hipsCm}cm — model ${matchedModel.hipsCm}cm`,
        garmentEaseCm: hipsEase,
        matchErrorCm: hipsMatchErr,
      });

      labels.push({
        zone: 'length',
        label: m.inseamCm > 80 ? 'Full length' : m.inseamCm > 72 ? 'Regular' : 'Cropped',
        detail: `Inseam ${m.inseamCm}cm`,
        garmentEaseCm: 0,
        matchErrorCm: 0,
      });
    }

    if (category === 'Dresses') {
      const m = gm as DressMeasurements;

      const bustEase = m.bustCm - matchedModel.bustCm;
      labels.push({
        zone: 'bust',
        label: easeCmToLabel(bustEase, thresholds),
        detail: `Garment bust ${m.bustCm}cm`,
        garmentEaseCm: bustEase,
        matchErrorCm: matchedModel.bustCm - userMeasurements.bustCm,
      });

      const waistEase = m.waistCm - matchedModel.waistCm;
      labels.push({
        zone: 'waist',
        label: easeCmToLabel(waistEase, thresholds),
        detail: `Garment waist ${m.waistCm}cm`,
        garmentEaseCm: waistEase,
        matchErrorCm: matchedModel.waistCm - userMeasurements.waistCm,
      });

      labels.push({
        zone: 'length',
        label:
          m.lengthCm > 120
            ? 'Floor length'
            : m.lengthCm > 100
              ? 'Midi'
              : m.lengthCm > 70
                ? 'Knee'
                : 'Mini',
        detail: `Length ${m.lengthCm}cm`,
        garmentEaseCm: 0,
        matchErrorCm: 0,
      });
    }

    // §9.1 — Uncertainty qualification
    const qualifiedMessage =
      matchConfidenceTier !== 'close'
        ? 'Estimated fit based on your closest match — may vary'
        : undefined;

    return {
      labels: labels as unknown as any, // Prisma Json
      matchConfidenceTier,
      qualifiedMessage: qualifiedMessage ?? null,
    };
  }
}
