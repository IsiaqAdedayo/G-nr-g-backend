import { GarmentsService } from './garments.service.js';
import { GarmentFilterDto } from '../../common/dto/garment.dto.js';
export declare class GarmentsController {
    private readonly garmentsService;
    constructor(garmentsService: GarmentsService);
    findAll(filters: GarmentFilterDto): Promise<{
        items: ({
            brand: {
                website: string | null;
                id: string;
                name: string;
                logoUrl: string | null;
            };
        } & {
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        brand: {
            website: string | null;
            id: string;
            name: string;
            logoUrl: string | null;
        };
    } & {
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
    }>;
}
