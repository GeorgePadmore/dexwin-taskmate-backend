import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(
    userId: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<ApiResponse> {
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      userId,
    });
    await this.categoryRepository.save(category);

    return {
      response_code: 'CAT001',
      response_desc: 'Category created successfully',
      success: true,
      data: category,
    };
  }

  async findAll(): Promise<ApiResponse> {
    const categories = await this.categoryRepository.find({
      where: {
        // userId,
        active_status: true,
        del_status: false,
      },
    });

    return {
      response_code: 'CAT002',
      response_desc: 'Categories retrieved successfully',
      success: true,
      data: categories,
    };
  }

  async findOne(userId: string, id: string): Promise<ApiResponse> {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
        userId,
        active_status: true,
        del_status: false,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      response_code: 'CAT003',
      response_desc: 'Category retrieved successfully',
      success: true,
      data: category,
    };
  }

  async update(
    userId: string,
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ApiResponse> {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
        userId,
        active_status: true,
        del_status: false,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepository.update(id, updateCategoryDto);

    const updatedCategory = await this.categoryRepository.findOne({
      where: { id },
    });

    return {
      response_code: 'CAT004',
      response_desc: 'Category updated successfully',
      success: true,
      data: updatedCategory,
    };
  }

  async remove(userId: string, id: string): Promise<ApiResponse> {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
        userId,
        active_status: true,
        del_status: false,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    category.del_status = true;
    await this.categoryRepository.save(category);

    return {
      response_code: 'CAT005',
      response_desc: 'Category deleted successfully',
      success: true,
      data: null,
    };
  }
}
