import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { FilterTodoDto } from './dto/filter-todo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(
    @Request() req,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<ApiResponse> {
    return this.todosService.create(req.user.id, createTodoDto);
  }

  @Get()
  findAll(
    @Request() req,
    @Query() filterDto: FilterTodoDto,
  ): Promise<ApiResponse> {
    return this.todosService.findAll(req.user.id, filterDto);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string): Promise<ApiResponse> {
    return this.todosService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<ApiResponse> {
    return this.todosService.update(req.user.id, id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string): Promise<ApiResponse> {
    return this.todosService.remove(req.user.id, id);
  }

  @Patch(':id/toggle')
  toggleStatus(@Request() req, @Param('id') id: string): Promise<ApiResponse> {
    return this.todosService.toggleStatus(req.user.id, id);
  }
}
