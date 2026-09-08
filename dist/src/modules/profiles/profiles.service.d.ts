import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateMeasurementsDto } from '../../common/dto/measurements.dto.js';
import { CreateAppearanceDto } from '../../common/dto/appearance.dto.js';
import { UpdateProfileDto } from '../../common/dto/profile.dto.js';
export declare class ProfilesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getOrCreateProfile(userId: string): Promise<{
        body: {
            waistCm: number;
            inseamCm: number | null;
            bustCm: number;
            shoulderCm: number | null;
            id: string;
            heightCm: number;
            hipsCm: number;
            weightKg: number | null;
            profileId: string;
        } | null;
        appearance: {
            id: string;
            skinTone: string;
            skinToneName: string;
            hairColour: string;
            ageRange: string;
            build: string;
            profileId: string;
        } | null;
    } & {
        id: string;
        bodyShape: string | null;
        userId: string;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        body: {
            waistCm: number;
            inseamCm: number | null;
            bustCm: number;
            shoulderCm: number | null;
            id: string;
            heightCm: number;
            hipsCm: number;
            weightKg: number | null;
            profileId: string;
        } | null;
        appearance: {
            id: string;
            skinTone: string;
            skinToneName: string;
            hairColour: string;
            ageRange: string;
            build: string;
            profileId: string;
        } | null;
    } & {
        id: string;
        bodyShape: string | null;
        userId: string;
    }>;
    upsertBody(userId: string, dto: CreateMeasurementsDto): Promise<{
        waistCm: number;
        inseamCm: number | null;
        bustCm: number;
        shoulderCm: number | null;
        id: string;
        heightCm: number;
        hipsCm: number;
        weightKg: number | null;
        profileId: string;
    }>;
    getBody(userId: string): Promise<{
        waistCm: number;
        inseamCm: number | null;
        bustCm: number;
        shoulderCm: number | null;
        id: string;
        heightCm: number;
        hipsCm: number;
        weightKg: number | null;
        profileId: string;
    } | null>;
    upsertAppearance(userId: string, dto: CreateAppearanceDto): Promise<{
        id: string;
        skinTone: string;
        skinToneName: string;
        hairColour: string;
        ageRange: string;
        build: string;
        profileId: string;
    }>;
    getAppearance(userId: string): Promise<{
        id: string;
        skinTone: string;
        skinToneName: string;
        hairColour: string;
        ageRange: string;
        build: string;
        profileId: string;
    } | null>;
    getUser(userId: string): Promise<{
        profile: ({
            body: {
                waistCm: number;
                inseamCm: number | null;
                bustCm: number;
                shoulderCm: number | null;
                id: string;
                heightCm: number;
                hipsCm: number;
                weightKg: number | null;
                profileId: string;
            } | null;
            appearance: {
                id: string;
                skinTone: string;
                skinToneName: string;
                hairColour: string;
                ageRange: string;
                build: string;
                profileId: string;
            } | null;
        } & {
            id: string;
            bodyShape: string | null;
            userId: string;
        }) | null;
        likeness: ({
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
            matchDistance: number;
            matchConfidenceTier: string;
            matchedModelId: string;
        }) | null;
    } & {
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string | null;
        unit: string;
    }>;
    updateUser(userId: string, data: {
        name?: string;
        email?: string;
    }): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string | null;
        unit: string;
    }>;
}
