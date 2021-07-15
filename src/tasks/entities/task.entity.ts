import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  isFinished: boolean;

  @ManyToOne((type) => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  user: User;
}
