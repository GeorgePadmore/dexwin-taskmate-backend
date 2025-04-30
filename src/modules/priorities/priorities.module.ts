import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrioritiesService } from './priorities.service';
import { PrioritiesController } from './priorities.controller';
import { Priority } from './entities/priority.entity';
import { PrioritiesSeeder } from './priorities.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Priority])],
  controllers: [PrioritiesController],
  providers: [PrioritiesService, PrioritiesSeeder],
  exports: [PrioritiesService],
})
export class PrioritiesModule {}
