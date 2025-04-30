import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePriorityDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  code?: string;
}
