import {
  Controller,
  Get,
  Put,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service.js';
import { CreateMeasurementsDto } from '../../common/dto/measurements.dto.js';
import { CreateAppearanceDto } from '../../common/dto/appearance.dto.js';
import { UpdateProfileDto } from '../../common/dto/profile.dto.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';

@ApiTags('Profiles')
@Controller()
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  // ── User (§23: GET/PATCH /users/me) ──────────────────────────────────────

  @Get('users/me')
  @ApiOperation({ summary: 'Get current user with full profile' })
  async getMe(@Request() req: any) {
    return this.profilesService.getUser(req.userId);
  }

  @Patch('users/me')
  @ApiOperation({ summary: 'Update current user' })
  async updateMe(@Request() req: any, @Body() body: { name?: string; email?: string }) {
    return this.profilesService.updateUser(req.userId, body);
  }

  // ── Body measurements (§23: GET/PUT /profiles/body) ──────────────────────

  @Get('profiles/body')
  @ApiOperation({ summary: 'Get body measurements' })
  async getBody(@Request() req: any) {
    return this.profilesService.getBody(req.userId);
  }

  @Put('profiles/body')
  @ApiOperation({ summary: 'Create or update body measurements' })
  async upsertBody(@Request() req: any, @Body() dto: CreateMeasurementsDto) {
    return this.profilesService.upsertBody(req.userId, dto);
  }

  // ── Appearance (§23: GET/PUT /profiles/appearance) ───────────────────────

  @Get('profiles/appearance')
  @ApiOperation({ summary: 'Get appearance profile' })
  async getAppearance(@Request() req: any) {
    return this.profilesService.getAppearance(req.userId);
  }

  @Put('profiles/appearance')
  @ApiOperation({ summary: 'Create or update appearance profile' })
  async upsertAppearance(@Request() req: any, @Body() dto: CreateAppearanceDto) {
    return this.profilesService.upsertAppearance(req.userId, dto);
  }

  // ── Profile settings (unit, bodyShape) ────────────────────────────────────

  @Patch('profiles')
  @ApiOperation({ summary: 'Update profile settings (unit, bodyShape)' })
  async updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.profilesService.updateProfile(req.userId, dto);
  }
}
