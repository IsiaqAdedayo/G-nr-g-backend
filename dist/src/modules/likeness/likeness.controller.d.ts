import { LikenessService } from './likeness.service.js';
import { MatchLikenessDto } from '../../common/dto/likeness.dto.js';
export declare class LikenessController {
    private readonly likenessService;
    constructor(likenessService: LikenessService);
    match(req: any, dto: MatchLikenessDto): Promise<import("./matching.service.js").MatchOutcome>;
    get(req: any): Promise<{
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
    update(req: any, body: {
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
