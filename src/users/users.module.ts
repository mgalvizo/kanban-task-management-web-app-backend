import { Module } from '@nestjs/common';
// Connect entity to parent module
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { BoardsModule } from 'src/boards/boards.module';
import { AbilityModule } from 'src/ability/ability.module';

@Module({
  // Create repository
  // Import the whole module
  imports: [TypeOrmModule.forFeature([User]), BoardsModule, AbilityModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
