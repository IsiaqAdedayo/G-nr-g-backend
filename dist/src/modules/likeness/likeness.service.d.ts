import { PrismaService } from '../../prisma/prisma.service.js';
import { MatchingService, type MatchOutcome } from './matching.service.js';
export declare class LikenessService {
    private readonly prisma;
    private readonly matching;
    constructor(prisma: PrismaService, matching: MatchingService);
    matchAndPersist(userId: string, skinTone?: string): Promise<MatchOutcome>;
    get(userId: string): Promise<{
        matchedModel: {
            waistCm: number;
            inseamCm: number;
            bustCm: number;
            shoulderCm: number;
            id: string;
            name: string;
            heightCm: number;
            hipsCm: number;
            skinTone: string;
            skinToneName: string;
            hairColour: string;
            ageRange: string;
            build: string;
            gender: string;
            baseImg: string;
            description: string;
            createdAt: Date;
        };
    } & {
        waistCm: number;
        inseamCm: number | null;
        bustCm: number;
        shoulderCm: number | null;
        id: string;
        heightCm: number;
        hipsCm: number;
        skinTone: string;
        hairColour: string;
        ageRange: string;
        build: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        matchedModelId: string;
        matchDistance: number;
        matchConfidenceTier: string;
    }>;
    update(userId: string, data: {
        matchedModelId?: string;
    }): Promise<{
        matchedModel: {
            waistCm: number;
            inseamCm: number;
            bustCm: number;
            shoulderCm: number;
            id: string;
            name: string;
            heightCm: number;
            hipsCm: number;
            skinTone: string;
            skinToneName: string;
            hairColour: string;
            ageRange: string;
            build: string;
            gender: string;
            baseImg: string;
            description: string;
            createdAt: Date;
        };
    } & {
        waistCm: number;
        inseamCm: number | null;
        bustCm: number;
        shoulderCm: number | null;
        id: string;
        heightCm: number;
        hipsCm: number;
        skinTone: string;
        hairColour: string;
        ageRange: string;
        build: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        matchedModelId: string;
        matchDistance: number;
        matchConfidenceTier: string;
    }>;
}
