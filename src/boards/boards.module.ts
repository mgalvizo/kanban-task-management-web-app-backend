import { Module } from '@nestjs/common';
// Connect entity to parent module
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { Board } from './board.entity';
import { ListsModule } from 'src/lists/lists.module';

@Module({
  // Create repository
  // Import the whole module
  imports: [TypeOrmModule.forFeature([Board]), ListsModule],
  providers: [BoardsService],
  controllers: [BoardsController],
  exports: [BoardsService],
})
export class BoardsModule {}
