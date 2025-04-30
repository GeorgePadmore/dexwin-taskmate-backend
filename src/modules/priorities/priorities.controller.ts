import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PrioritiesService } from './priorities.service';
import { CreatePriorityDto } from './dto/create-priority.dto';
import { UpdatePriorityDto } from './dto/update-priority.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

@Controller('priorities')
@UseGuards(JwtAuthGuard)
export class PrioritiesController {
  constructor(private readonly prioritiesService: PrioritiesService) {}

  @Post()
  create(@Body() createPriorityDto: CreatePriorityDto): Promise<ApiResponse> {
    return this.prioritiesService.create(createPriorityDto);
  }

  @Get()
  findAll(): Promise<ApiResponse> {
    return this.prioritiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ApiResponse> {
    return this.prioritiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePriorityDto: UpdatePriorityDto,
  ): Promise<ApiResponse> {
    return this.prioritiesService.update(id, updatePriorityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ApiResponse> {
    return this.prioritiesService.remove(id);
  }
}
