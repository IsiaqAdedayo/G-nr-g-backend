import type { Garment, ModelPreset, BodyProfile, FitAnalysis } from '@prisma/client';
type MatchConfidenceTier = 'close' | 'moderate' | 'loose';
export declare class FitEngineService {
    computeFit(garment: Garment, matchedModel: ModelPreset, userMeasurements: Pick<BodyProfile, 'heightCm' | 'bustCm' | 'waistCm' | 'hipsCm' | 'shoulderCm' | 'inseamCm'>, matchConfidenceTier: MatchConfidenceTier): Omit<FitAnalysis, 'id' | 'tryOnId' | 'createdAt'>;
}
export {};
