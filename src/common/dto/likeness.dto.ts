import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MatchLikenessDto {
  @ApiPropertyOptional({
    description: 'Optionally pass a specific skin tone to filter models',
  })
  @IsOptional()
  @IsString()
  skinTone?: string;
}
