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
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ListDto } from './dtos/list.dto';
import { ListsService } from './lists.service';
import { TasksService } from 'src/tasks/tasks.service';
import { UpdateListDto } from './dtos/update-list.dto';
import { TaskDto } from 'src/tasks/dtos/task.dto';
import { CreateTaskDto } from 'src/tasks/dtos/create-task.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AbilityFactory, Action } from 'src/ability/ability.factory';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { checkAbilities } from 'src/ability/check-abilities';
import { BoardsService } from 'src/boards/boards.service';

export const getUserBoards = async (
  whichUser: User,
  currentUser: User,
  boardsService: BoardsService,
) => {
  const boards = await boardsService.findAllBoardsOfUser(
    whichUser,
    currentUser,
  );

  return boards;
};

@Controller('lists')
@UseGuards(AuthGuard)
export class ListsController {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly listsService: ListsService,
    private readonly tasksService: TasksService,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  @Get('/:id')
  @Serialize(ListDto)
  async findList(@Param('id') id: string, @CurrentUser() currentUser: User) {
    const boards = await getUserBoards(
      currentUser,
      currentUser,
      this.boardsService,
    );

    if (!boards) {
      throw new NotFoundException('No boards found for this user');
    }

    const ability = this.abilityFactory.defineAbility(currentUser, boards);

    const list = await this.listsService.findOne(Number(id));

    if (!list) {
      throw new NotFoundException('list not found');
    }

    checkAbilities(ability, Action.Read, list);

    return list;
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
  async updateList(
    @Param('id') id: string,
    @Body() body: UpdateListDto,
    @CurrentUser() currentUser: User,
  ) {
    const boards = await getUserBoards(
      currentUser,
      currentUser,
      this.boardsService,
    );

    if (!boards) {
      throw new NotFoundException('No boards found for this user');
    }

    return this.listsService.update(Number(id), body, currentUser, boards);
  }

  @Delete('/:id')
  @Serialize(ListDto)
  async removeList(@Param('id') id: string, @CurrentUser() currentUser: User) {
    const boards = await getUserBoards(
      currentUser,
      currentUser,
      this.boardsService,
    );

    if (!boards) {
      throw new NotFoundException('No boards found for this user');
    }

    return this.listsService.remove(Number(id), currentUser, boards);
  }
}
