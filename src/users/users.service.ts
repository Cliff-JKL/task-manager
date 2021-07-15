import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createdUserDto: CreateUserDto): Promise<User> {
    const createdUser = new User();
    createdUser.username = createdUserDto.username;
    createdUser.password = createdUserDto.password;

    return await this.usersRepository.save(createdUser);
  }

  async findOne(username: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({
      where: { username: username },
    });
  }

  async findById(id: string): Promise<User | undefined> {
    return await this.usersRepository.findOne(id);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.usersRepository.findOne(id);

    if (updatedUser == undefined) {
      throw new NotFoundException();
    }

    return await this.usersRepository.save({
      ...updatedUser,
      ...updateUserDto,
    });
  }

  async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
