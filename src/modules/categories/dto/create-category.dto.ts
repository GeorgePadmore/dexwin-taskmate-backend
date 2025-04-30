import { IsString, IsNotEmpty, IsOptional, IsHexColor } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Work',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'A description of the category',
    example: 'Tasks related to work and professional activities',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The color of the category in hex format',
    example: '#FF5733',
  })
  @IsHexColor()
  @IsNotEmpty()
  color: string;
}
