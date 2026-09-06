import {
  IsString,
  IsIn,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppearanceDto {
  @ApiProperty({ description: 'Skin tone hex colour', example: '#C8956C' })
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  skinTone!: string;

  @ApiProperty({ description: 'Skin tone label', example: 'Golden Tan' })
  @IsString()
  skinToneName!: string;

  @ApiProperty({ description: 'Hair colour', example: 'black' })
  @IsString()
  @IsIn(['black', 'brown', 'blonde', 'red', 'grey'])
  hairColour!: string;

  @ApiProperty({ description: 'Age range', example: '26-35' })
  @IsString()
  @IsIn(['18-25', '26-35', '36-45', '46-55', '55+'])
  ageRange!: string;

  @ApiProperty({ description: 'Build type', example: 'average' })
  @IsString()
  @IsIn(['slim', 'average', 'athletic', 'full', 'plus'])
  build!: string;
}
