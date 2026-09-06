import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service.js';
import { FitEngineService } from '../fit-analysis/fit-engine.service.js';
interface TryOnJobData {
    tryOnId: string;
    userId: string;
    likenessId: string;
    garmentId: string;
}
export declare class TryOnProcessor extends WorkerHost {
    private readonly prisma;
    private readonly fitEngine;
    private readonly logger;
    constructor(prisma: PrismaService, fitEngine: FitEngineService);
    process(job: Job<TryOnJobData>): Promise<any>;
}
export {};
