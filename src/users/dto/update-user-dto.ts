import { IsBoolean, IsString } from 'class-validator';
import { Task } from '../../tasks/entities/task.entity';

export class UpdateUserDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;

  readonly tasks: Task[];
}
