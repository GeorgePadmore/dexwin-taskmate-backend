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
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @Request() req,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ApiResponse> {
    return this.categoriesService.create(req.user.id, createCategoryDto);
  }

  @Get()
  findAll(): Promise<ApiResponse> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string): Promise<ApiResponse> {
    return this.categoriesService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ApiResponse> {
    return this.categoriesService.update(req.user.id, id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string): Promise<ApiResponse> {
    return this.categoriesService.remove(req.user.id, id);
  }
}
