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
var MatchingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../../prisma/prisma.service.js");
const WEIGHTS = {
    bust: 1.2,
    waist: 1.2,
    hips: 1.2,
    height: 0.8,
    shoulder: 0.6,
};
function getConfidenceTier(distance) {
    if (distance < 0.15)
        return 'close';
    if (distance < 0.35)
        return 'moderate';
    return 'loose';
}
function luminance(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return 0.299 * r + 0.587 * g + 0.114 * b;
}
function skinToneSimilarity(userTone, modelTone) {
    return Math.abs(luminance(userTone) - luminance(modelTone)) < 80;
}
function computeRanges(models) {
    const heights = models.map((m) => m.heightCm);
    const busts = models.map((m) => m.bustCm);
    const waists = models.map((m) => m.waistCm);
    const hips = models.map((m) => m.hipsCm);
    const shoulders = models.map((m) => m.shoulderCm);
    return {
        heightRange: Math.max(...heights) - Math.min(...heights),
        bustRange: Math.max(...busts) - Math.min(...busts),
        waistRange: Math.max(...waists) - Math.min(...waists),
        hipsRange: Math.max(...hips) - Math.min(...hips),
        shoulderRange: Math.max(...shoulders) - Math.min(...shoulders),
    };
}
function measurementDistance(user, model, ranges) {
    const terms = [];
    terms.push(WEIGHTS.bust * ((user.bustCm - model.bustCm) / ranges.bustRange) ** 2);
    terms.push(WEIGHTS.waist * ((user.waistCm - model.waistCm) / ranges.waistRange) ** 2);
    terms.push(WEIGHTS.hips * ((user.hipsCm - model.hipsCm) / ranges.hipsRange) ** 2);
    terms.push(WEIGHTS.height * ((user.heightCm - model.heightCm) / ranges.heightRange) ** 2);
    if (user.shoulderCm != null) {
        terms.push(WEIGHTS.shoulder * ((user.shoulderCm - model.shoulderCm) / ranges.shoulderRange) ** 2);
    }
    return Math.sqrt(terms.reduce((a, b) => a + b, 0));
}
let MatchingService = MatchingService_1 = class MatchingService {
    prisma;
    logger = new common_1.Logger(MatchingService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async match(body, appearance) {
        const allModels = await this.prisma.modelPreset.findMany();
        if (allModels.length === 0) {
            throw new Error('No model presets in database — run seed first');
        }
        const ranges = computeRanges(allModels);
        let candidates = allModels;
        if (appearance?.skinTone) {
            const filtered = allModels.filter((m) => skinToneSimilarity(appearance.skinTone, m.skinTone));
            if (filtered.length >= 3) {
                candidates = filtered;
            }
        }
        const ranked = candidates
            .map((model) => ({
            model,
            distance: measurementDistance(body, model, ranges),
        }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5)
            .map((r, idx) => ({
            ...r,
            confidenceTier: getConfidenceTier(r.distance),
            rank: idx + 1,
        }));
        const best = ranked[0];
        this.logger.log(`Matched model "${best.model.name}" (distance: ${best.distance.toFixed(4)}, tier: ${best.confidenceTier})`);
        return {
            matchedModel: best.model,
            matchDistance: best.distance,
            matchConfidenceTier: best.confidenceTier,
            topCandidates: ranked,
        };
    }
};
exports.MatchingService = MatchingService;
exports.MatchingService = MatchingService = MatchingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], MatchingService);
//# sourceMappingURL=matching.service.js.map