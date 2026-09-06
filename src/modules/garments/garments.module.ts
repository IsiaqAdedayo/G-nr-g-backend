import { Module } from '@nestjs/common';
import { GarmentsService } from './garments.service.js';
import { GarmentsController } from './garments.controller.js';

@Module({
  controllers: [GarmentsController],
  providers: [GarmentsService],
  exports: [GarmentsService],
})
export class GarmentsModule {}
