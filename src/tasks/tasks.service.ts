import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task-dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(
    createdTaskDto: CreateTaskDto,
    creatorUid: string,
  ): Promise<Task> {
    const createdTask = new Task();
    createdTask.text = createdTaskDto.text;
    createdTask.isFinished = createdTaskDto.isFinished;
    createdTask.creatorUid = creatorUid;

    return await this.tasksRepository.save(createdTask);
  }

  async findOneById(id: number): Promise<Task | undefined> {
    const task = await this.tasksRepository.findOne({
      relations: ['user'],
      where: { id: id },
    });

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }

  async findUserCreatedTasks(
    creator: string,
    isFinished?: boolean,
    offset?: number,
    length?: number,
  ): Promise<Task[]> {
    const tasks = await this.tasksRepository.find({
      where: {
        creatorUid: creator,
        isFinished: isFinished === null ? true : isFinished,
      },
      skip: offset ? offset : null,
      take: length ? length : null,
    });

    return tasks;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    creator: string,
  ): Promise<Task> {
    const updatedTask = await this.tasksRepository.findOne({
      relations: ['user'],
      where: { id: id, creatorUid: creator },
    });

    if (!updatedTask) {
      throw new NotFoundException();
    }

    const task = await this.tasksRepository.save({
      ...updatedTask,
      ...updateTaskDto,
    });

    return task;
  }

  async delete(id: number, creatorUid: string): Promise<void> {
    const deletedTask = await this.tasksRepository.findOne({
      where: { creatorUid: creatorUid, id: id },
    });
    if (!deletedTask) {
      throw new NotFoundException();
    }
    await this.tasksRepository.delete(deletedTask);
  }
}
