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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TryOnsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryOnsService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const prisma_service_js_1 = require("../../prisma/prisma.service.js");
const node_crypto_1 = require("node:crypto");
const AI_MODEL_VERSION = 'v1';
const RENDER_CONFIG_VERSION = 'v1';
function computeInputSignature(likenessId, garmentId) {
    const raw = `${likenessId}:${garmentId}:${AI_MODEL_VERSION}:${RENDER_CONFIG_VERSION}`;
    return (0, node_crypto_1.createHash)('sha256').update(raw).digest('hex').slice(0, 32);
}
let TryOnsService = TryOnsService_1 = class TryOnsService {
    prisma;
    tryOnQueue;
    logger = new common_1.Logger(TryOnsService_1.name);
    constructor(prisma, tryOnQueue) {
        this.prisma = prisma;
        this.tryOnQueue = tryOnQueue;
    }
    async create(userId, dto) {
        const likeness = await this.prisma.virtualLikeness.findUnique({
            where: { userId },
        });
        if (!likeness) {
            throw new common_1.BadRequestException('No likeness found. Create your likeness first.');
        }
        const garment = await this.prisma.garment.findUnique({
            where: { id: dto.garmentId },
        });
        if (!garment) {
            throw new common_1.NotFoundException(`Garment ${dto.garmentId} not found`);
        }
        const inputSignature = computeInputSignature(likeness.id, garment.id);
        const existing = await this.prisma.tryOn.findUnique({
            where: { inputSignature },
        });
        if (existing) {
            if (existing.status === 'completed' || existing.status === 'processing' || existing.status === 'queued') {
                this.logger.log(`Returning existing try-on ${existing.id} (status: ${existing.status})`);
                return existing;
            }
            if (existing.status === 'failed') {
                await this.prisma.tryOn.delete({ where: { id: existing.id } });
            }
        }
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentCount = await this.prisma.tryOn.count({
            where: {
                userId,
                createdAt: { gte: oneHourAgo },
            },
        });
        if (recentCount >= 20) {
            throw new common_1.BadRequestException('You\'ve hit your try-on limit for now. Please try again later.');
        }
        const tryOn = await this.prisma.tryOn.create({
            data: {
                userId,
                likenessId: likeness.id,
                garmentId: garment.id,
                inputSignature,
                status: 'queued',
            },
            include: { garment: true, likeness: { include: { matchedModel: true } } },
        });
        await this.tryOnQueue.add('generate', {
            tryOnId: tryOn.id,
            userId,
            likenessId: likeness.id,
            garmentId: garment.id,
        }, {
            jobId: tryOn.id,
            attempts: 2,
            backoff: { type: 'exponential', delay: 5000 },
        });
        this.logger.log(`Queued try-on job ${tryOn.id} for user ${userId}`);
        return tryOn;
    }
    async findOne(id, userId) {
        const tryOn = await this.prisma.tryOn.findFirst({
            where: { id, userId },
            include: {
                garment: true,
                likeness: { include: { matchedModel: true } },
                fitAnalysis: true,
            },
        });
        if (!tryOn)
            throw new common_1.NotFoundException(`Try-on ${id} not found`);
        return tryOn;
    }
    async getStatus(id, userId) {
        const tryOn = await this.prisma.tryOn.findFirst({
            where: { id, userId },
            select: {
                id: true,
                status: true,
                resultUrl: true,
                error: true,
                createdAt: true,
                completedAt: true,
            },
        });
        if (!tryOn)
            throw new common_1.NotFoundException(`Try-on ${id} not found`);
        return tryOn;
    }
};
exports.TryOnsService = TryOnsService;
exports.TryOnsService = TryOnsService = TryOnsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)('try-on-generation')),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        bullmq_2.Queue])
], TryOnsService);
//# sourceMappingURL=try-ons.service.js.map