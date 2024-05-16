import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';

@Injectable()
export class BoardsService {
  constructor(
    // repo is an instance of a TypeORM repository that deals with instances of Boards
    // @InjectRepository tells the dependency injection system that we need the Board repository
    @InjectRepository(Board) private readonly repo: Repository<Board>,
  ) {}

  create(name: string) {
    // Create board entity instance
    const board = this.repo.create({ name });

    // Save the entity instance and run its hooks if any
    return this.repo.save(board);
  }
}
