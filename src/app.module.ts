import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardsModule } from './boards/boards.module';
import { ListsModule } from './lists/lists.module';
import { TasksModule } from './tasks/tasks.module';
import { SubtasksModule } from './subtasks/subtasks.module';

@Module({
  imports: [BoardsModule, ListsModule, TasksModule, SubtasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
