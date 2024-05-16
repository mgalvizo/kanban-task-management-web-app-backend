import { DataSource, DataSourceOptions } from 'typeorm';

// Needed database information for the TypeORM CLI
export const appDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  entities: ['**/*.entity.ts'],
  migrations: [__dirname + '/migrations/*.ts'],
} as DataSourceOptions);
