import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { TaskDto } from './dtos/task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TasksService } from './tasks.service';
import { SubtaskDto } from 'src/subtasks/dtos/subtask.dto';
import { SubtasksService } from 'src/subtasks/subtasks.service';
import { CreateSubtaskDto } from 'src/subtasks/dtos/create-subtask.dto';
import { DataSource } from 'typeorm';
import { List } from 'src/lists/list.entity';
import { Board } from 'src/boards/board.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly subtasksService: SubtasksService,
    private readonly dataSource: DataSource,
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
    @CurrentUser() user: User,
  ) {
    const task = await this.tasksService.findOne(Number(id));

    if (!task) {
      throw new NotFoundException('task not found');
    }

    const list = await this.dataSource
      .getRepository(List)
      .createQueryBuilder()
      .select('*')
      .where('list.id = :listId', { listId: task.listId })
      .getRawOne();

    const board = await this.dataSource
      .getRepository(Board)
      .createQueryBuilder()
      .select('*')
      .where('board.id = :boardId', { boardId: list.boardId })
      .getRawOne();

    if (user.id !== board.userId) {
      throw new ForbiddenException('you can only create on own tasks');
    }

    return this.subtasksService.createSubtask(body, task);
  }

  @Patch('/:id')
  @Serialize(TaskDto)
  updateTask(
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.tasksService.update(Number(id), body, user);
  }

  @Delete('/:id')
  @Serialize(TaskDto)
  removeTask(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.remove(Number(id), user);
  }
}
