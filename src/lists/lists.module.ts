import { Module } from '@nestjs/common';
// Connect entity to parent module
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { List } from './list.entity';
import { TasksModule } from 'src/tasks/tasks.module';
import { AbilityModule } from 'src/ability/ability.module';

@Module({
  imports: [TypeOrmModule.forFeature([List]), TasksModule, AbilityModule],
  providers: [ListsService],
  controllers: [ListsController],
  // Export the service
  exports: [ListsService],
})
export class ListsModule {}
