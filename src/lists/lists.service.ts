import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './list.entity';
import { Board } from 'src/boards/board.entity';

@Injectable()
export class ListsService {
  // repo is an instance of a TypeORM repository that deals with instances of Boards
  // @InjectRepository tells the dependency injection system that we need the Board repository
  constructor(
    @InjectRepository(List) private readonly repo: Repository<List>,
  ) {}

  findAllListsOfBoard(board: Board) {
    return this.repo.find({ where: { board } });
  }
}
