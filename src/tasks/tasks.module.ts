import { Module } from '@nestjs/common';
// Connect entity to parent module
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './task.entity';
import { SubtasksModule } from 'src/subtasks/subtasks.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), SubtasksModule],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}
