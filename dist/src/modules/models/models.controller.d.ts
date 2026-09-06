import { ModelsService } from './models.service.js';
export declare class ModelsController {
    private readonly modelsService;
    constructor(modelsService: ModelsService);
    findAll(): Promise<{
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
    }[]>;
    findOne(id: string): Promise<{
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
    }>;
}
