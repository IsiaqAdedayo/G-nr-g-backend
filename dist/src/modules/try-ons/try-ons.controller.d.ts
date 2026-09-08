import { TryOnsService } from './try-ons.service.js';
import { CreateTryOnDto } from '../../common/dto/try-on.dto.js';
export declare class TryOnsController {
    private readonly tryOnsService;
    constructor(tryOnsService: TryOnsService);
    create(req: any, dto: CreateTryOnDto): Promise<{
        error: string | null;
        id: string;
        createdAt: Date;
        userId: string;
        garmentId: string;
        inputSignature: string;
        likenessId: string;
        status: string;
        resultUrl: string | null;
        provider: string | null;
        providerModel: string | null;
        latencyMs: number | null;
        completedAt: Date | null;
    }>;
    findOne(id: string, req: any): Promise<{
        garment: {
            id: string;
            name: string;
            description: string;
            createdAt: Date;
            brandId: string;
            price: number;
            currency: string;
            category: string;
            images: string[];
            colors: import("@prisma/client/runtime/client").JsonValue;
            sizes: string[];
            fit: string;
            material: string;
            stretch: string;
            garmentMeasurements: import("@prisma/client/runtime/client").JsonValue;
            purchaseUrl: string | null;
            fittedImg: string | null;
            updatedAt: Date;
        };
        likeness: {
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
        };
        fitAnalysis: {
            id: string;
            createdAt: Date;
            matchConfidenceTier: string;
            tryOnId: string;
            labels: import("@prisma/client/runtime/client").JsonValue;
            qualifiedMessage: string | null;
        } | null;
    } & {
        error: string | null;
        id: string;
        createdAt: Date;
        userId: string;
        garmentId: string;
        inputSignature: string;
        likenessId: string;
        status: string;
        resultUrl: string | null;
        provider: string | null;
        providerModel: string | null;
        latencyMs: number | null;
        completedAt: Date | null;
    }>;
    getStatus(id: string, req: any): Promise<{
        error: string | null;
        id: string;
        createdAt: Date;
        status: string;
        resultUrl: string | null;
        completedAt: Date | null;
    }>;
}
