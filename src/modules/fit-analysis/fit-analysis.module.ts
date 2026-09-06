import { Module } from '@nestjs/common';
import { FitEngineService } from './fit-engine.service.js';

@Module({
  providers: [FitEngineService],
  exports: [FitEngineService],
})
export class FitAnalysisModule {}
