import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../../modules/categories/entities/category.entity';
import { SystemUserSeeder } from './system-user.seeder';

@Injectable()
export class CategorySeeder {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private systemUserSeeder: SystemUserSeeder,
  ) {}

  async seed(): Promise<void> {
    const systemUserId = await this.systemUserSeeder.seed();

    const categories = [
      {
        name: 'Work',
        description: 'Tasks related to work and professional activities',
        color: '#FF5733',
        userId: systemUserId,
      },
      {
        name: 'Personal',
        description: 'Personal tasks and activities',
        color: '#33FF57',
        userId: systemUserId,
      },
      {
        name: 'Health',
        description: 'Health and fitness related tasks',
        color: '#3357FF',
        userId: systemUserId,
      },
      {
        name: 'Shopping',
        description: 'Shopping and errands',
        color: '#F333FF',
        userId: systemUserId,
      },
      {
        name: 'Education',
        description: 'Learning and educational tasks',
        color: '#FF33F3',
        userId: systemUserId,
      },
      {
        name: 'Family',
        description: 'Family related tasks and activities',
        color: '#33FFF3',
        userId: systemUserId,
      },
      {
        name: 'Finance',
        description: 'Financial tasks and budgeting',
        color: '#F3FF33',
        userId: systemUserId,
      },
      {
        name: 'Travel',
        description: 'Travel planning and related tasks',
        color: '#FF3333',
        userId: systemUserId,
      },
    ];

    for (const category of categories) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: category.name },
      });

      if (!existingCategory) {
        await this.categoryRepository.save(category);
      }
    }
  }
}
