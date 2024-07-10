import { forwardRef, Module } from '@nestjs/common';
// Connect entity to parent module
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { List } from './list.entity';
import { TasksModule } from 'src/tasks/tasks.module';
import { AbilityModule } from 'src/ability/ability.module';
import { BoardsModule } from 'src/boards/boards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([List]),
    TasksModule,
    forwardRef(() => BoardsModule),
    AbilityModule,
  ],
  providers: [ListsService],
  controllers: [ListsController],
  // Export the service
  exports: [ListsService],
})
export class ListsModule {}
