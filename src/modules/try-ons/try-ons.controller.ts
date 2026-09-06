import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TryOnsService } from './try-ons.service.js';
import { CreateTryOnDto } from '../../common/dto/try-on.dto.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';

@ApiTags('Try-Ons')
@Controller('try-ons')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class TryOnsController {
  constructor(private readonly tryOnsService: TryOnsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a virtual try-on job' })
  async create(@Request() req: any, @Body() dto: CreateTryOnDto) {
    return this.tryOnsService.create(req.userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get try-on result with fit analysis' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.tryOnsService.findOne(id, req.userId);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get try-on job status (for polling)' })
  async getStatus(@Param('id') id: string, @Request() req: any) {
    return this.tryOnsService.getStatus(id, req.userId);
  }
}
