import {
  IsString,
  IsOptional,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'Preferred measurement unit' })
  @IsOptional()
  @IsString()
  @IsIn(['metric', 'imperial'])
  unit?: string;

  @ApiPropertyOptional({
    description: 'Body shape',
    enum: ['rectangle', 'hourglass', 'pear', 'apple', 'athletic'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['rectangle', 'hourglass', 'pear', 'apple', 'athletic'])
  bodyShape?: string;
}
