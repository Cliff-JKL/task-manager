import { CreateUserDto } from './create-user.dto';
import { User } from '../entities/user.entity';

export class GetUserDto extends CreateUserDto {
  createdTasks;

  constructor(entity: User) {
    super();
    this.email = entity.email;
    this.username = entity.username;
    this.createdTasks = entity.createdTasks.map((task) => {
      return {
        id: task.id,
        name: task.text,
        isFinished: task.isFinished,
      };
    });
  }
}
