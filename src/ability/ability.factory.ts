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
  Manage = 'manage', // wildcard for any action
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

// Multiple subjects can be added e.g. InferSubjects<typeof User | typeof Post>
// "all" is a wildcard for any subject
export type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    // ADMIN
    if (user.isAdmin) {
      can(Action.Manage, 'all');
    } else {
      // USERS
      can(Action.Read, User, { id: user.id });
      cannot(Action.Read, User, { id: { $ne: user.id } }).because(
        'You can only read own data',
      );
    }

    // Build set of abilities for a given user
    return build({
      detectSubjectType: (item) =>
        // Check the objects constructor and figures out what type of subject we are talking about
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
