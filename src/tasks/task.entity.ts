import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { List } from 'src/lists/list.entity';
import { Subtask } from 'src/subtasks/subtask.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  // @ManyToOne adds the column to the database
  // Creates relation n - 1
  @ManyToOne(() => List, (list) => list.tasks)
  list: List;

  // Creates relation 1 - n
  @OneToMany(() => Subtask, (subtask) => subtask.task)
  subtasks: Subtask[];
}
