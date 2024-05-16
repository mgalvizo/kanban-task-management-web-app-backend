import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeORMConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  dbConfig = {
    type: this.configService.get<any>('DB_TYPE'),
    synchronize: JSON.parse(this.configService.get<string>('SYNCHRONIZE')),
    autoLoadEntities: true,
  };

  createTypeOrmOptions(
    connectionName?: string,
  ): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    // Get our proper database environment variable to use 'development', 'test', 'production'
    switch (process.env.NODE_ENV) {
      case 'development':
        return Object.assign(this.dbConfig, {
          database: this.configService.get<string>('DB_NAME'),
        });
      case 'test':
        return Object.assign(this.dbConfig, {
          database: this.configService.get<string>('DB_NAME'),
          migrationsRun: JSON.parse(
            this.configService.get<string>('MIGRATIONS_RUN'),
          ),
        });
      case 'production':
        return Object.assign(this.dbConfig, {
          url: process.env.DATABASE_URL,
          migrationsRun: JSON.parse(
            this.configService.get<string>('MIGRATIONS_RUN'),
          ),
          // Specifically for heroku
          ssl: {
            rejectUnauthorized: JSON.parse(
              this.configService.get<string>('SSL'),
            ),
          },
        });
      default:
        throw new Error('unknown configuration');
    }
  }
}
