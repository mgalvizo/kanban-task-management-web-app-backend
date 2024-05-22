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

@Controller('boards')
@UseGuards(AuthGuard)
export class BoardsController {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly listsService: ListsService,
  ) {}

  @Get()
  @Serialize(BoardDto)
  findAllBoards() {
    return this.boardsService.find();
  }

  @Get('/:id')
  @Serialize(BoardDto)
  async findBoard(@Param('id') id: string) {
    const board = await this.boardsService.findOne(Number(id));

    if (!board) {
      throw new NotFoundException('board not found');
    }

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
    @CurrentUser() user: User,
  ) {
    const board = await this.boardsService.findOne(Number(id));

    if (!board) {
      throw new NotFoundException('board not found');
    }

    return this.listsService.createList(body, board, user);
  }

  @Patch('/:id')
  @Serialize(BoardDto)
  updateBoard(@Param('id') id: string, @Body() body: UpdateBoardDto) {
    return this.boardsService.update(Number(id), body);
  }

  @Delete('/:id')
  @Serialize(BoardDto)
  removeBoard(@Param('id') id: string) {
    return this.boardsService.remove(Number(id));
  }
}
