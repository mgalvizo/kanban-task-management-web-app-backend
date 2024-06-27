import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
  UseGuards,
  ForbiddenException,
  Session,
  Request,
} from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { BoardsService } from 'src/boards/boards.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from './user.entity';
import { AbilityFactory, Action } from 'src/ability/ability.factory';
import { checkAbilities } from 'src/ability/check-abilities';

@Controller('users')
@UseGuards(AuthGuard)
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly boardsService: BoardsService,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  @Get('/:id')
  async findUser(@Param('id') id: string, @CurrentUser() currentUser: User) {
    // Using casl validation here
    const ability = this.abilityFactory.defineAbility(currentUser);

    const user = await this.usersService.findOne(Number(id));

    if (!user) {
      throw new NotFoundException('user not found');
    }

    // User can only read own data
    checkAbilities(ability, Action.Read, user);

    return user;
  }

  // TODO
  // Check this endpoint works as expected with CASL ability
  @Get('/:id/boards')
  async findAllBoardsOfUser(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
  ) {
    const user = await this.usersService.findOne(Number(id));

    return this.boardsService.findAllBoardsOfUser(user, currentUser);
  }

  @Get()
  findAllUsers(
    @Query('email') email: string,
    @CurrentUser() currentUser: User,
  ) {
    if (!currentUser.isAdmin) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    return this.usersService.find(email);
  }

  @Patch('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.update(Number(id), body, currentUser);
  }

  @Delete('/:id')
  removeUser(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
    @Session() session: any,
  ) {
    return this.usersService.remove(Number(id), currentUser, session);
  }
}
