import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Subtask } from './subtask.entity';
import { Task } from 'src/tasks/task.entity';
import { CreateSubtaskDto } from './dtos/create-subtask.dto';

@Injectable()
export class SubtasksService {
  constructor(
    @InjectRepository(Subtask) private readonly repo: Repository<Subtask>,
  ) {}

  findAllSubtasksofTask(task: Task) {
    return this.repo.find({ where: { task } });
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  createSubtask(subtaskDto: CreateSubtaskDto, task: Task) {
    const subtask = this.repo.create(subtaskDto);

    subtask.task = task;

    return this.repo.save(subtask);
  }

  async update(id: number, attrs: Partial<Subtask>) {
    const subtask = await this.findOne(id);

    if (!subtask) {
      throw new NotFoundException('subtask not found');
    }

    Object.assign(subtask, attrs);

    return this.repo.save(subtask);
  }

  async remove(id: number) {
    const subtask = await this.findOne(id);

    if (!subtask) {
      throw new NotFoundException('subtask not found');
    }

    return this.repo.remove(subtask);
  }
}
