import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('increment')
  readonly id: number;

  @Column({ name: 'creator_uid', type: 'uuid' })
  creatorUid: string;

  @Column({ type: 'varchar', length: 50 })
  text: string;

  @Column({ type: 'boolean', default: false })
  isFinished: boolean;

  @ManyToOne((type) => User, (user) => user.createdTasks, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'creator_uid' })
  user: User;
}
