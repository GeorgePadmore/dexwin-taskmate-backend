import { IsNotEmpty, IsOptional, IsString, IsHexColor } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    description: 'The name of the category',
    example: 'Work',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    description: 'A description of the category',
    example: 'Tasks related to work and professional activities',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'The color of the category in hex format',
    example: '#FF5733',
  })
  @IsHexColor()
  @IsOptional()
  color?: string;
}
