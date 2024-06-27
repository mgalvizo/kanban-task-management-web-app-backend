import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AbilityFactory, Action } from 'src/ability/ability.factory';
import { ForbiddenError } from '@casl/ability';
import { checkAbilities } from 'src/ability/check-abilities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly abilityFactory: AbilityFactory,
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
    const ability = this.abilityFactory.defineAbility(currentUser);

    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    checkAbilities(ability, Action.Update, user);

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async remove(id: number, currentUser: User, session) {
    const ability = this.abilityFactory.defineAbility(currentUser);

    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    checkAbilities(ability, Action.Delete, user);

    // User is logged in and attempting to delete own account
    // log user out by removing the session
    if (currentUser.id === session.userId) {
      session.userId = null;
    }

    return this.repo.remove(user);
  }
}
