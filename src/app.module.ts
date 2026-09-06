import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';

// Infrastructure
import { PrismaModule } from './prisma/prisma.module.js';

// Feature modules
import { AuthModule } from './modules/auth/auth.module.js';
import { ProfilesModule } from './modules/profiles/profiles.module.js';
import { LikenessModule } from './modules/likeness/likeness.module.js';
import { GarmentsModule } from './modules/garments/garments.module.js';
import { TryOnsModule } from './modules/try-ons/try-ons.module.js';
import { LooksModule } from './modules/looks/looks.module.js';
import { ModelsModule } from './modules/models/models.module.js';
import { BrandsModule } from './modules/brands/brands.module.js';
import { FitAnalysisModule } from './modules/fit-analysis/fit-analysis.module.js';
import { JobsModule } from './modules/jobs/jobs.module.js';
import { AiModule } from './modules/ai/ai.module.js';
import { UploadsModule } from './modules/uploads/uploads.module.js';

@Module({
  imports: [
    // Environment
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate limiting — §25.1
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60_000, // 1 minute
          limit: 60, // 60 requests per minute general
        },
      ],
    }),

    // Redis / BullMQ — §7
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),

    // Prisma (global)
    PrismaModule,

    // Feature modules
    AuthModule,
    ProfilesModule,
    LikenessModule,
    GarmentsModule,
    TryOnsModule,
    LooksModule,
    ModelsModule,
    BrandsModule,
    FitAnalysisModule,
    JobsModule,
    AiModule,
    UploadsModule,
  ],
})
export class AppModule {}
