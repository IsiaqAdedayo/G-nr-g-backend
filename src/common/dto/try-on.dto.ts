import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTryOnDto {
  @ApiProperty({ description: 'ID of the garment to try on' })
  @IsString()
  @IsNotEmpty()
  garmentId!: string;
}
