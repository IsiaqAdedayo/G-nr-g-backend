import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LikenessService } from './likeness.service.js';
import { MatchLikenessDto } from '../../common/dto/likeness.dto.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';

@ApiTags('Likeness')
@Controller('likeness')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class LikenessController {
  constructor(private readonly likenessService: LikenessService) {}

  @Post('match')
  @ApiOperation({ summary: 'Run model matching and persist likeness' })
  async match(@Request() req: any, @Body() dto: MatchLikenessDto) {
    return this.likenessService.matchAndPersist(req.userId, dto.skinTone);
  }

  @Get()
  @ApiOperation({ summary: 'Get active likeness' })
  async get(@Request() req: any) {
    return this.likenessService.get(req.userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update likeness (e.g. adjust matched model)' })
  async update(@Request() req: any, @Body() body: { matchedModelId?: string }) {
    return this.likenessService.update(req.userId, body);
  }
}
