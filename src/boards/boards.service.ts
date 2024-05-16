import { Injectable, NotFoundException } from '@nestjs/common';
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

  find() {
    // Returns an array of records or an empty array
    return this.repo.find();
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  create(name: string) {
    // Create board entity instance
    const board = this.repo.create({ name });

    // Save the entity instance and run its hooks if any
    return this.repo.save(board);
  }

  async update(id: number, attrs: Partial<Board>) {
    const board = await this.findOne(id);

    if (!board) {
      throw new NotFoundException('board not found');
    }

    // Copies all enumerable own properties from one or more source objects to a target object (overrides existing properties).
    Object.assign(board, attrs);

    return this.repo.save(board);
  }

  async remove(id: number) {
    const board = await this.findOne(id);

    if (!board) {
      throw new NotFoundException('board not found');
    }

    return this.repo.remove(board);
  }
}
