import { PrismaService } from '../../prisma/prisma.service.js';
import type { ModelPreset, BodyProfile, AppearanceProfile } from '@prisma/client';
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
export declare class MatchingService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    match(body: BodyProfile, appearance?: AppearanceProfile | null): Promise<MatchOutcome>;
}
