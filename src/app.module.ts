import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
// Needed to set up database connection
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardsModule } from './boards/boards.module';
import { ListsModule } from './lists/lists.module';
import { TasksModule } from './tasks/tasks.module';
import { SubtasksModule } from './subtasks/subtasks.module';
import { TypeORMConfigService } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    // This works along with data-source.ts and typeorm.config.ts
    TypeOrmModule.forRootAsync({
      useClass: TypeORMConfigService,
    }),
    BoardsModule,
    ListsModule,
    TasksModule,
    SubtasksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // Any extraneous properties in the body that we are NOT expecting would NOT be included
        // The request will still fire, but extra properties not defined in the DTO will be filtered
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
