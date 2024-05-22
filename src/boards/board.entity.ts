import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { List } from '../lists/list.entity';
import { User } from '../users/user.entity';

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  userId: number;

  // Creates relation 1 - n
  @OneToMany(() => List, (list) => list.board)
  lists: List[];

  // @ManyToOne adds the column to the database
  // Creates relation n - 1
  @ManyToOne(() => User, (user) => user.boards)
  user: User;
}
