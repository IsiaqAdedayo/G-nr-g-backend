import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GarmentsService } from './garments.service.js';
import { GarmentFilterDto } from '../../common/dto/garment.dto.js';

@ApiTags('Garments')
@Controller('garments')
export class GarmentsController {
  constructor(private readonly garmentsService: GarmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Browse garment catalog with filters' })
  async findAll(@Query() filters: GarmentFilterDto) {
    return this.garmentsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get garment details by ID' })
  async findOne(@Param('id') id: string) {
    return this.garmentsService.findOne(id);
  }
}
