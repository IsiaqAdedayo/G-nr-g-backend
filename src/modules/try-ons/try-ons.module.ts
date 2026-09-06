import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TryOnsService } from './try-ons.service.js';
import { TryOnsController } from './try-ons.controller.js';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'try-on-generation',
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 20,
      },
    }),
  ],
  controllers: [TryOnsController],
  providers: [TryOnsService],
  exports: [TryOnsService],
})
export class TryOnsModule {}
