import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './list.entity';
import { Board } from 'src/boards/board.entity';
import { CreateListDto } from './dtos/create-list.dto';
import { AbilityFactory, Action } from 'src/ability/ability.factory';
import { User } from 'src/users/user.entity';
import { checkAbilities } from 'src/ability/check-abilities';

@Injectable()
export class ListsService {
  // repo is an instance of a TypeORM repository that deals with instances of Boards
  // @InjectRepository tells the dependency injection system that we need the Board repository
  constructor(
    @InjectRepository(List) private readonly repo: Repository<List>,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async findAllListsOfBoard(board: Board, currentUser: User) {
    if (currentUser.isAdmin) {
      return this.repo.find({ where: { board } });
    }

    const ability = this.abilityFactory.defineAbility(currentUser);

    // Check if we can read the board to output its lists
    checkAbilities(ability, Action.Read, board);

    const lists = await this.repo.find({ where: { board } });

    return lists;
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  createList(listDto: CreateListDto, board: Board) {
    const list = this.repo.create(listDto);

    // We assign the entire entity but the repository will only extract the id to form the relation
    list.board = board;

    return this.repo.save(list);
  }

  async update(id: number, attrs: Partial<List>) {
    const list = await this.findOne(id);

    if (!list) {
      throw new NotFoundException('list not found');
    }

    // Copies all enumerable own properties from one or more source objects to a target object (overrides existing properties).
    Object.assign(list, attrs);

    return this.repo.save(list);
  }

  async remove(id: number) {
    const list = await this.findOne(id);

    if (!list) {
      throw new NotFoundException('list not found');
    }

    return this.repo.remove(list);
  }
}
