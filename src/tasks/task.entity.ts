import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { List } from '../lists/list.entity';
import { Subtask } from '../subtasks/subtask.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  listId: number;

  // @ManyToOne adds the column to the database
  // Creates relation n - 1
  @ManyToOne(() => List, (list) => list.tasks)
  list: List;

  // Creates relation 1 - n
  @OneToMany(() => Subtask, (subtask) => subtask.task)
  subtasks: Subtask[];
}
