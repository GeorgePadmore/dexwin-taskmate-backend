import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { CategorySeeder } from '../services/seeders/category.seeder';

@Injectable()
export class SeedCommand {
  constructor(private readonly categorySeeder: CategorySeeder) {}

  @Command({
    command: 'seed:categories',
    describe: 'Seed categories',
  })
  async seedCategories() {
    console.log('Seeding categories...');
    await this.categorySeeder.seed();
    console.log('Categories seeded successfully!');
  }
}
