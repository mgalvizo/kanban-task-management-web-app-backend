import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { TaskDto } from './dtos/task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TasksService } from './tasks.service';
import { SubtaskDto } from 'src/subtasks/dtos/subtask.dto';
import { SubtasksService } from 'src/subtasks/subtasks.service';
import { CreateSubtaskDto } from 'src/subtasks/dtos/create-subtask.dto';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly subtasksService: SubtasksService,
  ) {}

  @Get('/:id')
  @Serialize(TaskDto)
  getTask(@Param('id') id: string) {
    return this.tasksService.findOne(Number(id));
  }

  @Get('/:id/subtasks')
  @Serialize(SubtaskDto)
  async findAllSubtasksofTask(@Param('id') id: string) {
    const task = await this.tasksService.findOne(Number(id));

    if (!task) {
      throw new NotFoundException('task not found');
    }

    return this.subtasksService.findAllSubtasksofTask(task);
  }

  @Post('/:id/subtasks')
  @Serialize(SubtaskDto)
  async createSubtaskInTask(
    @Param('id') id: string,
    @Body() body: CreateSubtaskDto,
  ) {
    const task = await this.tasksService.findOne(Number(id));

    if (!task) {
      throw new NotFoundException('task not found');
    }

    return this.subtasksService.createSubtask(body, task);
  }

  @Patch('/:id')
  @Serialize(TaskDto)
  updateTask(@Param('id') id: string, @Body() body: UpdateTaskDto) {
    return this.tasksService.update(Number(id), body);
  }

  @Delete('/:id')
  @Serialize(TaskDto)
  removeTask(@Param('id') id: string) {
    return this.tasksService.remove(Number(id));
  }
}
