import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UploadsService } from './uploads.service.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { IsString, IsIn } from 'class-validator';

class GetUploadUrlDto {
  @IsString()
  filename!: string;

  @IsString()
  @IsIn(['image/jpeg', 'image/png', 'image/webp'])
  mimeType!: string;
}

@ApiTags('Uploads')
@Controller('uploads')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('signed-url')
  @ApiOperation({ summary: 'Get a signed upload URL' })
  async getSignedUrl(@Body() dto: GetUploadUrlDto) {
    return this.uploadsService.getSignedUploadUrl(dto.filename, dto.mimeType);
  }
}
