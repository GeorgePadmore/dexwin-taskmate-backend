import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../../modules/categories/entities/category.entity';
import { User } from '../../../modules/users/entities/user.entity';
import { CategorySeeder } from './category.seeder';
import { SystemUserSeeder } from './system-user.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Category, User])],
  providers: [CategorySeeder, SystemUserSeeder],
  exports: [CategorySeeder, SystemUserSeeder],
})
export class SeederModule {}
