import {
  InferSubjects,
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';

export enum Action {
  Manage = 'manage', // Any action
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const builder = new AbilityBuilder<AppAbility>(createMongoAbility);
    const { can, cannot, build } = builder;

    // Admin abilities
    if (user.isAdmin) {
      can(Action.Manage, 'all');
    } else {
      // Every other user abilities
      can(Action.Read, 'all');
    }

    // Build a set of abilities for a user
    return build({
      detectSubjectType: (item) =>
        // Checks the constructor to find out the Subject type
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
