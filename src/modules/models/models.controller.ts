import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ModelsService } from './models.service.js';

@ApiTags('Models')
@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  @ApiOperation({ summary: 'List all model presets' })
  async findAll() {
    return this.modelsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get model preset by ID' })
  async findOne(@Param('id') id: string) {
    return this.modelsService.findOne(id);
  }
}
