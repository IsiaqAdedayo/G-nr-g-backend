import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLookDto {
  @ApiProperty({ description: 'ID of the try-on result to save' })
  @IsString()
  @IsNotEmpty()
  tryOnId!: string;

  @ApiPropertyOptional({ description: 'Optional note or label' })
  @IsOptional()
  @IsString()
  note?: string;
}
