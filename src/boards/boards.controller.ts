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
import { BoardDto } from './dtos/board.dto';
import { BoardsService } from './boards.service';
import { ListsService } from 'src/lists/lists.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { CreateListDto } from 'src/lists/dtos/create-list.dto';
import { ListDto } from 'src/lists/dtos/list.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AbilityFactory, Action } from 'src/ability/ability.factory';
import { checkAbilities } from 'src/ability/check-abilities';

@Controller('boards')
@UseGuards(AuthGuard)
export class BoardsController {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly listsService: ListsService,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  @Get()
  @Serialize(BoardDto)
  findAllBoards(@CurrentUser() currentUser: User) {
    if (!currentUser.isAdmin) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    return this.boardsService.find();
  }

  @Get('/:id')
  @Serialize(BoardDto)
  async findBoard(@Param('id') id: string, @CurrentUser() currentUser: User) {
    // Using casl validation here
    const ability = this.abilityFactory.defineAbility(currentUser);

    const board = await this.boardsService.findOne(Number(id));

    if (!board) {
      throw new NotFoundException('board not found');
    }

    // User can only read own data
    checkAbilities(ability, Action.Read, board);

    return board;
  }

  @Get('/:id/lists')
  @Serialize(ListDto)
  async findAllListsOfBoard(@Param('id') id: string) {
    const board = await this.boardsService.findOne(Number(id));

    if (!board) {
      throw new NotFoundException('board not found');
    }

    return this.listsService.findAllListsOfBoard(board);
  }

  @Post()
  @Serialize(BoardDto)
  createBoard(@Body() body: CreateBoardDto, @CurrentUser() user: User) {
    const board = this.boardsService.create(body, user);

    return board;
  }

  @Post('/:id/lists')
  @Serialize(ListDto)
  async createListInBoard(
    @Body() body: CreateListDto,
    @Param('id') id: string,
  ) {
    const board = await this.boardsService.findOne(Number(id));

    if (!board) {
      throw new NotFoundException('board not found');
    }

    return this.listsService.createList(body, board);
  }

  @Patch('/:id')
  @Serialize(BoardDto)
  updateBoard(
    @Param('id') id: string,
    @Body() body: UpdateBoardDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.boardsService.update(Number(id), body, currentUser);
  }

  @Delete('/:id')
  @Serialize(BoardDto)
  removeBoard(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.boardsService.remove(Number(id), currentUser);
  }
}
