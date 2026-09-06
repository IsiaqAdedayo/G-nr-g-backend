import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LooksService } from './looks.service.js';
import { CreateLookDto } from '../../common/dto/look.dto.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';

@ApiTags('Looks')
@Controller('looks')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class LooksController {
  constructor(private readonly looksService: LooksService) {}

  @Get()
  @ApiOperation({ summary: 'List all saved looks' })
  async findAll(@Request() req: any) {
    return this.looksService.findAll(req.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Save a try-on result as a Look' })
  async create(@Request() req: any, @Body() dto: CreateLookDto) {
    return this.looksService.create(req.userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a saved look' })
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.looksService.remove(req.userId, id);
  }
}
