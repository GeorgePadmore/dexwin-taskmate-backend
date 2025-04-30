import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export enum TodoStatus {
  ALL = 'all',
  ACTIVE = 'A',
  COMPLETED = 'C',
}

export enum SortBy {
  DUE_DATE = 'dueDate',
  PRIORITY = 'priority',
  TITLE = 'title',
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class FilterTodoDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(TodoStatus)
  @Transform(({ value }) => value?.toLowerCase())
  status?: TodoStatus = TodoStatus.ALL;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  priorityId?: string;

  @IsOptional()
  @IsEnum(SortBy)
  @Transform(({ value }) => value?.toLowerCase())
  sortBy?: SortBy = SortBy.DUE_DATE;

  @IsOptional()
  @IsEnum(SortDirection)
  @Transform(({ value }) => value?.toUpperCase())
  sortDirection?: SortDirection = SortDirection.ASC;
}
