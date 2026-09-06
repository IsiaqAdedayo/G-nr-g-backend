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
var TryOnProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryOnProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../../prisma/prisma.service.js");
const fit_engine_service_js_1 = require("../fit-analysis/fit-engine.service.js");
let TryOnProcessor = TryOnProcessor_1 = class TryOnProcessor extends bullmq_1.WorkerHost {
    prisma;
    fitEngine;
    logger = new common_1.Logger(TryOnProcessor_1.name);
    constructor(prisma, fitEngine) {
        super();
        this.prisma = prisma;
        this.fitEngine = fitEngine;
    }
    async process(job) {
        const { tryOnId } = job.data;
        this.logger.log(`Processing try-on job ${tryOnId}`);
        await this.prisma.tryOn.update({
            where: { id: tryOnId },
            data: { status: 'processing' },
        });
        const startTime = Date.now();
        try {
            const tryOn = await this.prisma.tryOn.findUnique({
                where: { id: tryOnId },
                include: {
                    likeness: { include: { matchedModel: true } },
                    garment: true,
                },
            });
            if (!tryOn)
                throw new Error(`Try-on ${tryOnId} not found`);
            const resultUrl = tryOn.garment.fittedImg || tryOn.garment.images[0] || null;
            if (!resultUrl) {
                throw new Error('No result image available from provider');
            }
            const fitAnalysis = this.fitEngine.computeFit(tryOn.garment, tryOn.likeness.matchedModel, tryOn.likeness, tryOn.likeness.matchConfidenceTier);
            await this.prisma.fitAnalysis.create({
                data: {
                    tryOnId,
                    labels: fitAnalysis.labels,
                    matchConfidenceTier: fitAnalysis.matchConfidenceTier,
                    qualifiedMessage: fitAnalysis.qualifiedMessage,
                },
            });
            const latencyMs = Date.now() - startTime;
            await this.prisma.tryOn.update({
                where: { id: tryOnId },
                data: {
                    status: 'completed',
                    resultUrl,
                    latencyMs,
                    provider: 'mvp-simulation',
                    providerModel: 'placeholder-v1',
                    completedAt: new Date(),
                },
            });
            this.logger.log(`Try-on ${tryOnId} completed in ${latencyMs}ms`);
            return { resultUrl };
        }
        catch (error) {
            const latencyMs = Date.now() - startTime;
            await this.prisma.tryOn.update({
                where: { id: tryOnId },
                data: {
                    status: 'failed',
                    error: error.message || 'Unknown error',
                    latencyMs,
                    provider: 'mvp-simulation',
                },
            });
            this.logger.error(`Try-on ${tryOnId} failed: ${error.message}`);
            throw error;
        }
    }
};
exports.TryOnProcessor = TryOnProcessor;
exports.TryOnProcessor = TryOnProcessor = TryOnProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('try-on-generation', { concurrency: 1 }),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        fit_engine_service_js_1.FitEngineService])
], TryOnProcessor);
//# sourceMappingURL=try-on.processor.js.map