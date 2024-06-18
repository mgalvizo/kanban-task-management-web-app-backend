import {
  InferSubjects,
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { Board } from 'src/boards/board.entity';
import { List } from 'src/lists/list.entity';
import { Task } from 'src/tasks/task.entity';
import { Subtask } from 'src/subtasks/subtask.entity';

export enum Action {
  Manage = 'manage', // wildcard for any action
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

// Multiple subjects can be added e.g. InferSubjects<typeof User | typeof Post>
// "all" is a wildcard for any subject
export type Subjects =
  | InferSubjects<
      typeof User | typeof Board | typeof List | typeof Task | typeof Subtask
    >
  | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    // define rules
    const builder = new AbilityBuilder<AppAbility>(createMongoAbility);
    const { can, cannot, build } = builder;

    // conditions
    if (user.isAdmin) {
      can(Action.Manage, 'all'); // Instead of "all" the specific subject can be passed e.g. User
    } else {
      // for every other user
      can(Action.Read, User, { id: user.id });
      cannot(Action.Read, User, { id: { $ne: user.id } }).because(
        'You cannot manage other users',
      );
    }

    // build set of abilities for a given user
    return build({
      detectSubjectType: (item) =>
        // Check the objects constructor and figures out what type of subject we are talking about
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
