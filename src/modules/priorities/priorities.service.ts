import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Priority } from './entities/priority.entity';
import { CreatePriorityDto } from './dto/create-priority.dto';
import { UpdatePriorityDto } from './dto/update-priority.dto';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

@Injectable()
export class PrioritiesService {
  constructor(
    @InjectRepository(Priority)
    private priorityRepository: Repository<Priority>,
  ) {}

  async create(createPriorityDto: CreatePriorityDto): Promise<ApiResponse> {
    const priority = this.priorityRepository.create(createPriorityDto);
    await this.priorityRepository.save(priority);

    return {
      response_code: 'PRI001',
      response_desc: 'Priority created successfully',
      success: true,
      data: priority,
    };
  }

  async findAll(): Promise<ApiResponse> {
    const priorities = await this.priorityRepository.find({
      where: { active_status: true, del_status: false },
    });

    return {
      response_code: 'PRI002',
      response_desc: 'Priorities retrieved successfully',
      success: true,
      data: priorities,
    };
  }

  async findOne(id: string): Promise<ApiResponse> {
    const priority = await this.priorityRepository.findOne({
      where: { id, active_status: true, del_status: false },
    });

    if (!priority) {
      throw new NotFoundException('Priority not found');
    }

    return {
      response_code: 'PRI003',
      response_desc: 'Priority retrieved successfully',
      success: true,
      data: priority,
    };
  }

  async update(
    id: string,
    updatePriorityDto: UpdatePriorityDto,
  ): Promise<ApiResponse> {
    const priority = await this.priorityRepository.findOne({
      where: { id, active_status: true, del_status: false },
    });

    if (!priority) {
      throw new NotFoundException('Priority not found');
    }

    await this.priorityRepository.update(id, updatePriorityDto);

    const updatedPriority = await this.priorityRepository.findOne({
      where: { id },
    });

    return {
      response_code: 'PRI004',
      response_desc: 'Priority updated successfully',
      success: true,
      data: updatedPriority,
    };
  }

  async remove(id: string): Promise<ApiResponse> {
    const priority = await this.priorityRepository.findOne({
      where: { id, active_status: true, del_status: false },
    });

    if (!priority) {
      throw new NotFoundException('Priority not found');
    }

    priority.del_status = true;
    await this.priorityRepository.save(priority);

    return {
      response_code: 'PRI005',
      response_desc: 'Priority deleted successfully',
      success: true,
      data: null,
    };
  }
}
