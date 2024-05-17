import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './list.entity';
import { Board } from 'src/boards/board.entity';
import { CreateListDto } from './dtos/create-list.dto';

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

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  createList(name: string, board: Board) {
    const list = this.repo.create({ name });

    // We assign the entire entity but the repository will only extract the id to form the relation
    list.board = board;

    return this.repo.save(list);
  }
}
