import { Module } from '@nestjs/common';
import { LikenessService } from './likeness.service.js';
import { LikenessController } from './likeness.controller.js';
import { MatchingService } from './matching.service.js';

@Module({
  controllers: [LikenessController],
  providers: [LikenessService, MatchingService],
  exports: [LikenessService],
})
export class LikenessModule {}
