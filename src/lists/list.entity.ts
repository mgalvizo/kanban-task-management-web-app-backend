import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Board } from '../boards/board.entity';
import { Task } from '../tasks/task.entity';

@Entity()
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // @ManyToOne adds the column to the database
  // Creates relation n - 1
  @ManyToOne(() => Board, (board) => board.lists)
  board: Board;

  // Creates relation 1 - n
  @OneToMany(() => Task, (task) => task.list)
  tasks: Task[];
}
