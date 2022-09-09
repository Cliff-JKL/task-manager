import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Task } from '../tasks/entities/task.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly tasksService: TasksService,
  ) {}

  hashData(data: string): string {
    return bcrypt.hashSync(data, 10);
  }

  async create(createdUserDto: CreateUserDto): Promise<User> {
    const createdUser = new User();
    createdUser.email = createdUserDto.email;
    createdUser.username = createdUserDto.username;
    createdUser.password = this.hashData(createdUserDto.password);

    return await this.usersRepository.save(createdUser);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({
      relations: ['createdTasks'],
      where: { email: email },
    });
  }

  async findOneByUid(
    uid: string,
    relations?: string[],
  ): Promise<User | undefined> {
    return await this.usersRepository.findOne({
      relations: relations,
      where: { uid: uid },
    });
  }

  async update(uid: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.findOneByUid(uid, ['createdTasks']);

    if (!updatedUser) {
      throw new NotFoundException();
    }

    if (updateUserDto.password) {
      updateUserDto.password = this.hashData(updateUserDto.password);
    }

    return await this.usersRepository.save({
      ...updatedUser,
      ...updateUserDto,
    });
  }

  async delete(uid: string): Promise<void> {
    await this.usersRepository.delete({ uid: uid });
  }

  async findCreatedTasks(
    uid: string,
    isFinished?: boolean,
    offset?: number,
    length?: number,
  ): Promise<Task[]> {
    return await this.tasksService.findUserCreatedTasks(
      uid,
      isFinished,
      offset,
      length,
    );
  }
}
