import { ProfilesService } from './profiles.service.js';
import { CreateMeasurementsDto } from '../../common/dto/measurements.dto.js';
import { CreateAppearanceDto } from '../../common/dto/appearance.dto.js';
import { UpdateProfileDto } from '../../common/dto/profile.dto.js';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    getMe(req: any): Promise<{
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
    updateMe(req: any, body: {
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
    getBody(req: any): Promise<{
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
    upsertBody(req: any, dto: CreateMeasurementsDto): Promise<{
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
    getAppearance(req: any): Promise<{
        id: string;
        skinTone: string;
        skinToneName: string;
        hairColour: string;
        ageRange: string;
        build: string;
        profileId: string;
    } | null>;
    upsertAppearance(req: any, dto: CreateAppearanceDto): Promise<{
        id: string;
        skinTone: string;
        skinToneName: string;
        hairColour: string;
        ageRange: string;
        build: string;
        profileId: string;
    }>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<{
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
}
