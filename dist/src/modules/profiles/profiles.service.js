"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../../prisma/prisma.service.js");
let ProfilesService = class ProfilesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateProfile(userId) {
        let profile = await this.prisma.userProfile.findUnique({
            where: { userId },
            include: { body: true, appearance: true },
        });
        if (!profile) {
            profile = await this.prisma.userProfile.create({
                data: { userId },
                include: { body: true, appearance: true },
            });
        }
        return profile;
    }
    async updateProfile(userId, dto) {
        if (dto.unit) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { unit: dto.unit },
            });
        }
        const profile = await this.getOrCreateProfile(userId);
        return this.prisma.userProfile.update({
            where: { id: profile.id },
            data: { bodyShape: dto.bodyShape ?? profile.bodyShape },
            include: { body: true, appearance: true },
        });
    }
    async upsertBody(userId, dto) {
        const profile = await this.getOrCreateProfile(userId);
        const existingBody = await this.prisma.bodyProfile.findUnique({
            where: { profileId: profile.id },
        });
        if (existingBody) {
            return this.prisma.bodyProfile.update({
                where: { profileId: profile.id },
                data: dto,
            });
        }
        return this.prisma.bodyProfile.create({
            data: {
                profileId: profile.id,
                ...dto,
            },
        });
    }
    async getBody(userId) {
        const profile = await this.getOrCreateProfile(userId);
        return this.prisma.bodyProfile.findUnique({
            where: { profileId: profile.id },
        });
    }
    async upsertAppearance(userId, dto) {
        const profile = await this.getOrCreateProfile(userId);
        const existing = await this.prisma.appearanceProfile.findUnique({
            where: { profileId: profile.id },
        });
        if (existing) {
            return this.prisma.appearanceProfile.update({
                where: { profileId: profile.id },
                data: dto,
            });
        }
        return this.prisma.appearanceProfile.create({
            data: {
                profileId: profile.id,
                ...dto,
            },
        });
    }
    async getAppearance(userId) {
        const profile = await this.getOrCreateProfile(userId);
        return this.prisma.appearanceProfile.findUnique({
            where: { profileId: profile.id },
        });
    }
    async getUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: {
                    include: { body: true, appearance: true },
                },
                likeness: {
                    include: { matchedModel: true },
                },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async updateUser(userId, data) {
        return this.prisma.user.update({
            where: { id: userId },
            data,
        });
    }
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map