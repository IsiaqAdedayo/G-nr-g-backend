import { LooksService } from './looks.service.js';
import { CreateLookDto } from '../../common/dto/look.dto.js';
export declare class LooksController {
    private readonly looksService;
    constructor(looksService: LooksService);
    findAll(req: any): Promise<({
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
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        garmentId: string;
        likenessId: string;
        tryOnId: string | null;
        resultImg: string | null;
    })[]>;
    create(req: any, dto: CreateLookDto): Promise<{
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
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        garmentId: string;
        likenessId: string;
        tryOnId: string | null;
        resultImg: string | null;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        garmentId: string;
        likenessId: string;
        tryOnId: string | null;
        resultImg: string | null;
    }>;
}
