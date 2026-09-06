import {
  IsNumber,
  IsOptional,
  IsIn,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMeasurementsDto {
  @ApiProperty({ description: 'Height in centimetres', example: 170 })
  @IsNumber()
  @Min(100)
  @Max(230)
  heightCm!: number;

  @ApiProperty({ description: 'Bust/chest in centimetres', example: 90 })
  @IsNumber()
  @Min(50)
  @Max(160)
  bustCm!: number;

  @ApiProperty({ description: 'Natural waist in centimetres', example: 72 })
  @IsNumber()
  @Min(40)
  @Max(140)
  waistCm!: number;

  @ApiProperty({ description: 'Hips in centimetres', example: 96 })
  @IsNumber()
  @Min(60)
  @Max(170)
  hipsCm!: number;

  @ApiPropertyOptional({ description: 'Shoulder width in centimetres' })
  @IsOptional()
  @IsNumber()
  @Min(25)
  @Max(70)
  shoulderCm?: number;

  @ApiPropertyOptional({ description: 'Inseam in centimetres' })
  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(110)
  inseamCm?: number;

  @ApiPropertyOptional({ description: 'Weight in kilograms' })
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(200)
  weightKg?: number;
}
