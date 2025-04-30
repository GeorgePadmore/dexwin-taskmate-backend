import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Priority } from './entities/priority.entity';

@Injectable()
export class PrioritiesSeeder implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Priority)
    private priorityRepository: Repository<Priority>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedPriorities();
  }

  private async seedPriorities() {
    const defaultPriorities = [
      { name: 'High', code: 'HIGH' },
      { name: 'Medium', code: 'MEDIUM' },
      { name: 'Low', code: 'LOW' },
    ];

    for (const priority of defaultPriorities) {
      const existingPriority = await this.priorityRepository.findOne({
        where: { code: priority.code },
      });

      if (!existingPriority) {
        const newPriority = this.priorityRepository.create({
          ...priority,
          active_status: true,
          del_status: false,
        });
        await this.priorityRepository.save(newPriority);
      }
    }
  }
} 