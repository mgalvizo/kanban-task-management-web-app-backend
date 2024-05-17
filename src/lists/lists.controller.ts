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
import { ListDto } from './dtos/list.dto';
import { ListsService } from './lists.service';
import { TasksService } from 'src/tasks/tasks.service';
import { UpdateListDto } from './dtos/update-list.dto';
import { TaskDto } from 'src/tasks/dtos/task.dto';
import { CreateTaskDto } from 'src/tasks/dtos/create-task.dto';

@Controller('lists')
export class ListsController {
  constructor(
    private readonly listsService: ListsService,
    private readonly tasksService: TasksService,
  ) {}

  @Get('/:id')
  @Serialize(ListDto)
  findList(@Param('id') id: string) {
    return this.listsService.findOne(Number(id));
  }

  @Get('/:id/tasks')
  @Serialize(TaskDto)
  async findAllTasksOfList(@Param('id') id: string) {
    const list = await this.listsService.findOne(Number(id));

    if (!list) {
      throw new NotFoundException('list not found');
    }

    return this.tasksService.findAllTasksOfList(list);
  }

  @Post('/:id/tasks')
  @Serialize(TaskDto)
  async createTaskInList(@Body() body: CreateTaskDto, @Param('id') id: string) {
    const list = await this.listsService.findOne(Number(id));

    if (!list) {
      throw new NotFoundException('list not found');
    }

    return this.tasksService.createTask(body, list);
  }

  @Patch('/:id')
  @Serialize(ListDto)
  updateList(@Param('id') id: string, @Body() body: UpdateListDto) {
    return this.listsService.update(Number(id), body);
  }

  @Delete('/:id')
  @Serialize(ListDto)
  deleteList(@Param('id') id: string) {
    return this.listsService.remove(Number(id));
  }
}
