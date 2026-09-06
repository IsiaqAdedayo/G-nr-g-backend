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
exports.LikenessService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../../prisma/prisma.service.js");
const matching_service_js_1 = require("./matching.service.js");
let LikenessService = class LikenessService {
    prisma;
    matching;
    constructor(prisma, matching) {
        this.prisma = prisma;
        this.matching = matching;
    }
    async matchAndPersist(userId, skinTone) {
        const profile = await this.prisma.userProfile.findUnique({
            where: { userId },
            include: { body: true, appearance: true },
        });
        if (!profile?.body) {
            throw new common_1.NotFoundException('Body measurements not found. Create your profile first.');
        }
        const outcome = await this.matching.match(profile.body, skinTone ? { ...profile.appearance, skinTone } : profile.appearance);
        const existing = await this.prisma.virtualLikeness.findUnique({
            where: { userId },
        });
        const data = {
            userId,
            matchedModelId: outcome.matchedModel.id,
            matchDistance: outcome.matchDistance,
            matchConfidenceTier: outcome.matchConfidenceTier,
            heightCm: profile.body.heightCm,
            bustCm: profile.body.bustCm,
            waistCm: profile.body.waistCm,
            hipsCm: profile.body.hipsCm,
            shoulderCm: profile.body.shoulderCm,
            inseamCm: profile.body.inseamCm,
            skinTone: profile.appearance?.skinTone ?? '#C8956C',
            hairColour: profile.appearance?.hairColour ?? 'black',
            ageRange: profile.appearance?.ageRange ?? '26-35',
            build: profile.appearance?.build ?? 'average',
        };
        if (existing) {
            await this.prisma.virtualLikeness.update({
                where: { userId },
                data,
            });
        }
        else {
            await this.prisma.virtualLikeness.create({ data });
        }
        return outcome;
    }
    async get(userId) {
        const likeness = await this.prisma.virtualLikeness.findUnique({
            where: { userId },
            include: { matchedModel: true },
        });
        if (!likeness) {
            throw new common_1.NotFoundException('No likeness found. Create your likeness first.');
        }
        return likeness;
    }
    async update(userId, data) {
        const likeness = await this.prisma.virtualLikeness.findUnique({
            where: { userId },
        });
        if (!likeness) {
            throw new common_1.NotFoundException('No likeness found.');
        }
        return this.prisma.virtualLikeness.update({
            where: { userId },
            data,
            include: { matchedModel: true },
        });
    }
};
exports.LikenessService = LikenessService;
exports.LikenessService = LikenessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        matching_service_js_1.MatchingService])
], LikenessService);
//# sourceMappingURL=likeness.service.js.map