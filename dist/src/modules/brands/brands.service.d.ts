import { PrismaService } from '../../prisma/prisma.service.js';
export declare class BrandsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            garments: number;
        };
    } & {
        website: string | null;
        id: string;
        name: string;
        logoUrl: string | null;
    })[]>;
    findOne(id: string): Promise<{
        garments: {
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
        }[];
    } & {
        website: string | null;
        id: string;
        name: string;
        logoUrl: string | null;
    }>;
}
