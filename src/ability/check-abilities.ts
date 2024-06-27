import { ForbiddenError } from '@casl/ability';
import { Action, AppAbility, Subjects } from './ability.factory';
import { ForbiddenException } from '@nestjs/common';

export const checkAbilities = (
  ability: AppAbility,
  action: Action,
  subject: Subjects,
) => {
  try {
    ForbiddenError.from(ability).throwUnlessCan(action, subject);
  } catch (err) {
    if (err instanceof ForbiddenError) {
      throw new ForbiddenException(err.message);
    }
  }
};
