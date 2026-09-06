import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TryOnProcessor } from './try-on.processor.js';
import { FitEngineService } from '../fit-analysis/fit-engine.service.js';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'try-on-generation',
    }),
  ],
  providers: [TryOnProcessor, FitEngineService],
})
export class JobsModule {}
