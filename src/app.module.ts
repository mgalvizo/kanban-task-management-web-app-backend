import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardsModule } from './boards/boards.module';
import { ColumnsModule } from './columns/columns.module';
import { TasksModule } from './tasks/tasks.module';
import { SubtasksModule } from './subtasks/subtasks.module';

@Module({
  imports: [BoardsModule, ColumnsModule, TasksModule, SubtasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
