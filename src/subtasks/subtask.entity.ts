import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Task } from '../tasks/task.entity';

@Entity()
export class Subtask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  isDone: boolean;

  // @ManyToOne adds the column to the database
  // Creates relation n - 1
  @ManyToOne(() => Task, (task) => task.subtasks)
  task: Task;
}
