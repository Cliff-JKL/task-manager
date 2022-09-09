import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  UseGuards,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { GetTaskDto } from './dto/get-task.dto';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: User,
  ): Promise<Task> {
    const task = await this.tasksService.create(createTaskDto, user.uid);
    return task;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetTaskDto> {
    const task = await this.tasksService.findOneById(+id);
    return new GetTaskDto(task);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: User,
  ): Promise<GetTaskDto> {
    const updatedTask = await this.tasksService.update(
      +id,
      updateTaskDto,
      user.uid,
    );
    return new GetTaskDto(updatedTask);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    return await this.tasksService.delete(+id, user.uid);
  }
}
