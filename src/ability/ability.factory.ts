import {
  InferSubjects,
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Board } from 'src/boards/board.entity';
import { List } from 'src/lists/list.entity';
import { Subtask } from 'src/subtasks/subtask.entity';
import { Task } from 'src/tasks/task.entity';
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
export type Subjects =
  | InferSubjects<
      typeof User | typeof Board | typeof List | typeof Task | typeof Subtask
    >
  | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: User, boards?: Board[]) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    // ADMIN USER
    if (user.isAdmin) {
      can(Action.Manage, 'all');
    } else {
      // disallow everything by default
      cannot(Action.Manage, 'all').because('You can only manage own resources');
      // REGULAR USER
      can([Action.Read, Action.Update, Action.Delete], User, { id: user.id });
      // Board
      can([Action.Read, Action.Update, Action.Delete], Board, {
        userId: user.id,
      });

      // List (Column)
      if (boards) {
        can([Action.Read, Action.Update, Action.Delete], List, {
          boardId: { $in: boards.map((board) => board.id) },
        });
      }

      // Task
      // can([Action.Read, Action.Update, Action.Delete], Task, {
      //   list: { $elemMatch: { board: { userId: user.id } } },
      // });
      // Subtask
    }

    // Build set of abilities for a given user
    return build({
      detectSubjectType: (item) =>
        // Check the objects constructor and figures out what type of subject we are talking about
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
