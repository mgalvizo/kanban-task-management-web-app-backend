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
import { BoardDto } from './dtos/board.dto';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';

@Controller('boards')
@Serialize(BoardDto)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  findAllBoards() {
    return this.boardsService.find();
  }

  @Get('/:id')
  async findBoard(@Param('id') id: string) {
    const board = await this.boardsService.findOne(Number(id));

    if (!board) {
      throw new NotFoundException('board not found');
    }

    return board;
  }

  @Post()
  createBoard(@Body() body: CreateBoardDto) {
    const board = this.boardsService.create(body.name);

    return board;
  }

  @Patch('/:id')
  updateBoard(@Param('id') id: string, @Body() body: UpdateBoardDto) {
    return this.boardsService.update(Number(id), body);
  }

  @Delete('/:id')
  removeBoard(@Param('id') id: string) {
    return this.boardsService.remove(Number(id));
  }
}
