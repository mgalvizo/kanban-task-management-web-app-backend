import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { List } from 'src/lists/list.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Board } from 'src/boards/board.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly repo: Repository<Task>,
    private readonly dataSource: DataSource,
  ) {}

  findAllTasksOfList(list: List) {
    return this.repo.find({ where: { list } });
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  createTask(taskDto: CreateTaskDto, list: List) {
    const task = this.repo.create(taskDto);

    task.list = list;

    return this.repo.save(task);
  }

  async update(id: number, attrs: Partial<Task>, currentUser: User) {
    const task = await this.findOne(id);

    if (!task) {
      throw new NotFoundException('task not found');
    }

    // Get the listId
    const listId = task.listId;

    // Get the list data
    const list = await this.dataSource
      .getRepository(List)
      .createQueryBuilder()
      .select('*')
      .where('list.id = :id', { id: listId })
      .getRawOne();

    // Get the boardId of the list
    const boardId = list.boardId;

    const board = await this.dataSource
      .getRepository(Board)
      .createQueryBuilder()
      .select('*')
      .where('board.id = :boardId', { boardId })
      .getRawOne();

    // Get all the lists of the boardId
    const lists = await this.dataSource
      .getRepository(List)
      .createQueryBuilder()
      .select('*')
      .where('list.boardId = :boardId', { boardId })
      .getRawMany();

    // Map possible options
    const options = lists.map((list) => list.id);

    if (currentUser.id !== board.userId) {
      throw new ForbiddenException('you can only update own tasks');
    }

    // Check listId input is included in the options array
    if (!options.includes(attrs.listId)) {
      throw new UnprocessableEntityException('value not in options');
    }

    Object.assign(task, attrs);

    return this.repo.save(task);
  }

  async remove(id: number, currentUser: User) {
    const task = await this.findOne(id);

    if (!task) {
      throw new NotFoundException('task not found');
    }

    const listId = task.listId;

    const list = await this.dataSource
      .getRepository(List)
      .createQueryBuilder()
      .select('*')
      .where('list.id = :id', { id: listId })
      .getRawOne();

    const boardId = list.boardId;

    const board = await this.dataSource
      .getRepository(Board)
      .createQueryBuilder()
      .select('*')
      .where('board.id = :boardId', { boardId })
      .getRawOne();

    if (currentUser.id !== board.userId) {
      throw new ForbiddenException('you can only delete own tasks');
    }

    return this.repo.remove(task);
  }
}
