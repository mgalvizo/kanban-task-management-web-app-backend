import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './list.entity';
import { Board } from 'src/boards/board.entity';
import { CreateListDto } from './dtos/create-list.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ListsService {
  // repo is an instance of a TypeORM repository that deals with instances of Boards
  // @InjectRepository tells the dependency injection system that we need the Board repository
  constructor(
    @InjectRepository(List) private readonly repo: Repository<List>,
    private readonly dataSource: DataSource,
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

  createList(listDto: CreateListDto, board: Board, currentUser: User) {
    const list = this.repo.create(listDto);

    // We assign the entire entity but the repository will only extract the id to form the relation
    list.board = board;

    return this.repo.save(list);
  }

  async update(id: number, attrs: Partial<List>, currentUser: User) {
    const list = await this.findOne(id);

    if (!list) {
      throw new NotFoundException('list not found');
    }

    // We have to check the board because is the direct relation with the user and its permissions
    const boardId = list.boardId;

    const board = await this.dataSource
      .getRepository(Board)
      .createQueryBuilder()
      .select('*')
      .where('board.id = :boardId', { boardId })
      .getRawOne();

    if (currentUser.id !== board.userId) {
      throw new ForbiddenException('you can only update own lists');
    }

    // Copies all enumerable own properties from one or more source objects to a target object (overrides existing properties).
    Object.assign(list, attrs);

    return this.repo.save(list);
  }

  async remove(id: number, currentUser: User) {
    const list = await this.findOne(id);

    if (!list) {
      throw new NotFoundException('list not found');
    }

    // We have to check the board because is the direct relation with the user and its permissions
    const boardId = list.boardId;

    const board = await this.dataSource
      .getRepository(Board)
      .createQueryBuilder()
      .select('*')
      .where('board.id = :boardId', { boardId })
      .getRawOne();

    if (currentUser.id !== board.userId) {
      throw new ForbiddenException('you can only update own lists');
    }

    return this.repo.remove(list);
  }
}
