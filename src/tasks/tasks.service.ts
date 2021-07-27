import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task-dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private readonly usersService: UsersService,
  ) {}

  async create(createdTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const createdTask = new Task();
    createdTask.name = createdTaskDto.name;
    createdTask.isFinished = createdTaskDto.isFinished;

    const user = await this.usersService.findById(userId);
    if (user == undefined) {
      throw new NotFoundException();
    }

    createdTask.user = user;

    return await this.tasksRepository.save(createdTask);
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const updatedTask = await this.tasksRepository.findOne({
      where: { user: userId, id: id },
    });

    if (updatedTask == undefined) {
      throw new NotFoundException();
    }

    return await this.tasksRepository.save({
      ...updatedTask,
      ...updateTaskDto,
    });
  }

  async findOne(id: string, userId: string): Promise<Task | undefined> {
    return await this.tasksRepository.findOne({
      where: { user: userId, id: id },
    });
  }

  async findAll(userId: string): Promise<Task[]> {
    return await this.tasksRepository.find({ where: { user: userId } });
  }

  async delete(id: string, userId: string): Promise<Task> {
    const deletedTask = await this.tasksRepository.findOne({
      where: { user: userId, id: id },
    });
    if (deletedTask == undefined) {
      throw new NotFoundException();
    }
    return await this.tasksRepository.remove(deletedTask);
  }
}
