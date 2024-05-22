import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ListDto } from './dtos/list.dto';
import { ListsService } from './lists.service';
import { TasksService } from 'src/tasks/tasks.service';
import { UpdateListDto } from './dtos/update-list.dto';
import { TaskDto } from 'src/tasks/dtos/task.dto';
import { CreateTaskDto } from 'src/tasks/dtos/create-task.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Board } from 'src/boards/board.entity';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { DataSource } from 'typeorm';

@Controller('lists')
@UseGuards(AuthGuard)
export class ListsController {
  constructor(
    private readonly listsService: ListsService,
    private readonly tasksService: TasksService,
    private readonly dataSource: DataSource,
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
  async createTaskInList(
    @Body() body: CreateTaskDto,
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    const list = await this.listsService.findOne(Number(id));

    if (!list) {
      throw new NotFoundException('list not found');
    }

    const boardId = list.boardId;

    const board = await this.dataSource
      .getRepository(Board)
      .createQueryBuilder()
      .select('*')
      .where('board.id = :boardId', { boardId })
      .getRawOne();

    if (user.id !== board.userId) {
      throw new ForbiddenException('you can only create tasks in own lists');
    }

    return this.tasksService.createTask(body, list);
  }

  @Patch('/:id')
  @Serialize(ListDto)
  updateList(
    @Param('id') id: string,
    @Body() body: UpdateListDto,
    @CurrentUser() user: User,
  ) {
    return this.listsService.update(Number(id), body, user);
  }

  @Delete('/:id')
  @Serialize(ListDto)
  removeList(@Param('id') id: string, @CurrentUser() user: User) {
    return this.listsService.remove(Number(id), user);
  }
}
