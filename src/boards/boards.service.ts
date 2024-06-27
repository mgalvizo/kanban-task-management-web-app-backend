import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dtos/create-board.dto';
import { User } from 'src/users/user.entity';
import { AbilityFactory, Action } from 'src/ability/ability.factory';
import { checkAbilities } from 'src/ability/check-abilities';

@Injectable()
export class BoardsService {
  constructor(
    // repo is an instance of a TypeORM repository that deals with instances of Boards
    // @InjectRepository tells the dependency injection system that we need the Board repository
    @InjectRepository(Board) private readonly repo: Repository<Board>,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  find() {
    // Returns an array of records or an empty array
    return this.repo.find();
  }

  async findAllBoardsOfUser(user: User, currentUser: User) {
    if (currentUser.isAdmin) {
      return this.repo.find({ where: { user } });
    }

    const ability = this.abilityFactory.defineAbility(currentUser);

    const boards = await this.repo.find({ where: { user } });

    checkAbilities(ability, Action.Read, boards);

    return boards;
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  create(boardDto: CreateBoardDto, user: User) {
    // Create board entity instance
    const board = this.repo.create(boardDto);

    board.user = user;

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
