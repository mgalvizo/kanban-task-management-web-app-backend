import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { TaskDto } from './dtos/task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TasksService } from './tasks.service';

// `DELETE tasks/:id` Delete a task by ID

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('/:id')
  @Serialize(TaskDto)
  getTask(@Param('id') id: string) {
    return this.tasksService.findOne(Number(id));
  }

  @Patch('/:id')
  @Serialize(TaskDto)
  updateTask(@Param('id') id: string, @Body() body: UpdateTaskDto) {
    return this.tasksService.update(Number(id), body);
  }
}
