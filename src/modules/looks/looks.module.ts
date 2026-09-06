import { Module } from '@nestjs/common';
import { LooksService } from './looks.service.js';
import { LooksController } from './looks.controller.js';

@Module({
  controllers: [LooksController],
  providers: [LooksService],
  exports: [LooksService],
})
export class LooksModule {}
