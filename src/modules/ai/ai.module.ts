import { Module } from '@nestjs/common';
import { SimulationProvider } from './ai-provider.interface.js';

const AI_PROVIDER = {
  provide: 'VIRTUAL_TRYON_PROVIDER',
  useClass: SimulationProvider,
};

@Module({
  providers: [AI_PROVIDER],
  exports: ['VIRTUAL_TRYON_PROVIDER'],
})
export class AiModule {}
