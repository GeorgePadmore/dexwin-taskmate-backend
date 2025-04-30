import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePriorityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
