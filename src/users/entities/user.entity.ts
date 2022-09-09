import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { RefreshToken } from '../../auth/entities/refreshToken.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  readonly uid: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @OneToMany((type) => Task, (task) => task.user)
  createdTasks: Task[];

  @OneToMany((type) => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
}
