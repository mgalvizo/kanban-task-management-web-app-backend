import { Module } from '@nestjs/common';
// Connect entity to parent module
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { Board } from './board.entity';
import { ListsModule } from 'src/lists/lists.module';
import { AbilityModule } from 'src/ability/ability.module';

@Module({
  // Create repository
  // Import the whole module
  imports: [TypeOrmModule.forFeature([Board]), ListsModule, AbilityModule],
  providers: [BoardsService],
  controllers: [BoardsController],
  exports: [BoardsService],
})
export class BoardsModule {}
