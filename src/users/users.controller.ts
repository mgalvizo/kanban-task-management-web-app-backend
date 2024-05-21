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
} from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { BoardsService } from 'src/boards/boards.service';
import { AbilityGuard } from 'src/guards/ability/ability.guard';
import { CheckAbilities } from 'src/decorators/ability.decorator';
import { Action } from 'src/ability/ability.factory';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth/auth.guard';

//TODO
// Check all controllers

@Controller('users')
@UseGuards(AuthGuard)
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly boardsService: BoardsService,
  ) {}

  @Get('/:id')
  @UseGuards(AbilityGuard)
  @CheckAbilities({ action: Action.Read, subject: User })
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(Number(id));

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  @Get('/:id/boards')
  async findAllBoardsOfUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(Number(id));

    return this.boardsService.findAllBoardsOfUser(user);
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(Number(id), body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }
}
