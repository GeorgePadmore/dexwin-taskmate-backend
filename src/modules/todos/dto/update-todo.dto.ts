import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  @IsNotEmpty()
  dueDate?: string;

  @IsUUID()
  @IsOptional()
  priorityId?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;
}
