import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  UseGuards,
  Delete,
  HttpCode,
  HttpStatus,
  Request,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { Task } from '../tasks/entities/task.entity';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.create(createUserDto);
    return user;
  }

  @Get()
  async findOne(@CurrentUser() user: User): Promise<GetUserDto> {
    const userData = await this.usersService.findOneByEmail(user.email);
    return new GetUserDto(userData);
  }

  @Put()
  async update(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<GetUserDto> {
    const updatedUser = await this.usersService.update(user.uid, updateUserDto);
    return new GetUserDto(updatedUser);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async delete(@CurrentUser() user: User, @Request() req): Promise<void> {
    req.logout(() => this.usersService.delete(user.uid));
  }

  @Get('tasks/my')
  async findCreatedTasks(
    // TODO validate params
    @Query('isFinished') isFinished,
    @Query('offset') offset: number,
    @Query('length') length: number,
    @CurrentUser() user: User,
  ): Promise<{ tasks: Task[] }> {
    console.log(typeof isFinished);
    const userTasks = await this.usersService.findCreatedTasks(
      user.uid,
      isFinished,
      +offset,
      +length,
    );
    return {
      tasks: userTasks,
    };
  }
}
