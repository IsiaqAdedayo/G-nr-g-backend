import { PrismaService } from '../../prisma/prisma.service.js';
export declare class ModelsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
