import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Action, CaslAbilityFactory } from 'src/casl/casl-ability.factory';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>, currentUser: User) {
    const ability = this.caslAbilityFactory.createAbility(currentUser);
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (ability.cannot(Action.Update, user)) {
      throw new ForbiddenException('you can only update own data');
    }

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async remove(id: number, currentUser: User) {
    const ability = this.caslAbilityFactory.createAbility(currentUser);
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (ability.cannot(Action.Delete, user)) {
      throw new ForbiddenException('you can only delete own data');
    }

    return this.repo.remove(user);
  }
}
