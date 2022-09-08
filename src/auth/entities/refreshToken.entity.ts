import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'refresh_token' })
export class RefreshToken {
  @PrimaryGeneratedColumn('increment')
  readonly id: number;

  @Column({ name: 'user_uid', type: 'uuid' })
  userUid: string;

  @Column({ type: 'varchar', nullable: true })
  value: string;

  @ManyToOne((type) => User, (user) => user.refreshTokens, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_uid' })
  user: User;
}
