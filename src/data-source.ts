import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './users/user.entity';
import { Board } from './boards/board.entity';
import { List } from './lists/list.entity';
import { Task } from './tasks/task.entity';
import { Subtask } from './subtasks/subtask.entity';

// Needed database information for the TypeORM CLI
export const appDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  // entities: ['**/*.entity.ts'],
  entities: [User, Board, List, Task, Subtask],
  migrations: [__dirname + '/migrations/*.ts'],
} as DataSourceOptions);
