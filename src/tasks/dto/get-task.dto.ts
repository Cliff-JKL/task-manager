import { CreateTaskDto } from './create-task.dto';
import { Task } from '../entities/task.entity';
import { BaseUserInterface } from '../../users/interfaces/user.interface';

export class GetTaskDto extends CreateTaskDto {
  creator: BaseUserInterface;

  constructor(entity: Task) {
    super();
    this.text = entity.text;
    this.isFinished = entity.isFinished;
    this.creator = {
      username: entity.user.username,
      email: entity.user.email,
    };
  }
}
