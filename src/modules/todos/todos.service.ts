import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { FilterTodoDto, SortBy, TodoStatus } from './dto/filter-todo.dto';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async create(
    userId: string,
    createTodoDto: CreateTodoDto,
  ): Promise<ApiResponse> {
    const todo = this.todoRepository.create({
      ...createTodoDto,
      userId,
      status: TodoStatus.ACTIVE,
    });

    await this.todoRepository.save(todo);

    return {
      response_code: 'TODO001',
      response_desc: 'Todo created successfully',
      success: true,
      data: todo,
    };
  }

  async findAll(
    userId: string,
    filterDto: FilterTodoDto,
  ): Promise<ApiResponse> {
    const { status, categoryId, priorityId, search, sortBy, sortDirection } =
      filterDto;

    const query = this.todoRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.category', 'category')
      .leftJoinAndSelect('todo.priority', 'priority')
      .where('todo.userId = :userId', { userId })
      .andWhere('todo.del_status = :delStatus', { delStatus: false })
      .andWhere('todo.active_status = :activeStatus', { activeStatus: true });

    if (status && status !== TodoStatus.ALL) {
      query.andWhere('todo.status = :status', { status });
    }

    if (categoryId) {
      query.andWhere('todo.categoryId = :categoryId', { categoryId });
    }

    if (priorityId) {
      query.andWhere('todo.priorityId = :priorityId', { priorityId });
    }

    if (search) {
      query.andWhere(
        '(todo.title ILIKE :search OR todo.description ILIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    // Handle sorting
    switch (sortBy) {
      case SortBy.DUE_DATE:
        query.orderBy('todo.dueDate', sortDirection);
        break;
      case SortBy.PRIORITY:
        query.orderBy('priority.code', sortDirection);
        break;
      case SortBy.TITLE:
        query.orderBy('todo.title', sortDirection);
        break;
      default:
        query.orderBy('todo.dueDate', sortDirection);
    }

    const todos = await query.getMany();

    return {
      response_code: 'TODO002',
      response_desc: 'Todos retrieved successfully',
      success: true,
      data: todos,
    };
  }

  async findOne(userId: string, id: string): Promise<ApiResponse> {
    const todo = await this.todoRepository.findOne({
      where: {
        id,
        userId,
        active_status: true,
        del_status: false,
      },
      relations: ['category', 'priority'],
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return {
      response_code: 'TODO003',
      response_desc: 'Todo retrieved successfully',
      success: true,
      data: todo,
    };
  }

  async update(
    userId: string,
    id: string,
    updateTodoDto: UpdateTodoDto,
  ): Promise<ApiResponse> {
    const todo = await this.todoRepository.findOne({
      where: {
        id,
        userId,
        active_status: true,
        del_status: false,
      },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    await this.todoRepository.update(id, updateTodoDto);

    const updatedTodo = await this.todoRepository.findOne({
      where: { id },
      relations: ['category', 'priority'],
    });

    return {
      response_code: 'TODO004',
      response_desc: 'Todo updated successfully',
      success: true,
      data: updatedTodo,
    };
  }

  async remove(userId: string, id: string): Promise<ApiResponse> {
    const todo = await this.todoRepository.findOne({
      where: {
        id,
        userId,
        active_status: true,
        del_status: false,
      },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    todo.del_status = true;
    await this.todoRepository.save(todo);

    return {
      response_code: 'TODO005',
      response_desc: 'Todo deleted successfully',
      success: true,
      data: null,
    };
  }

  async toggleStatus(userId: string, id: string): Promise<ApiResponse> {
    const todo = await this.todoRepository.findOne({
      where: {
        id,
        userId,
        active_status: true,
        del_status: false,
      },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    todo.status =
      todo.status === TodoStatus.ACTIVE
        ? TodoStatus.COMPLETED
        : TodoStatus.ACTIVE;
    await this.todoRepository.save(todo);

    return {
      response_code: 'TODO006',
      response_desc: 'Todo status toggled successfully',
      success: true,
      data: todo,
    };
  }
}
