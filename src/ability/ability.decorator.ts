import { SetMetadata } from '@nestjs/common';
import { Action, Subjects } from './ability.factory';
import { User } from 'src/users/user.entity';

export interface RequiredRule {
  action: Action;
  subject: Subjects;
}

export const CHECK_ABILITY = 'check_ability';

export const CheckAbilities = (...requirements: RequiredRule[]) => {
  SetMetadata(CHECK_ABILITY, requirements);
};

// Reusable metadata with specific ability
