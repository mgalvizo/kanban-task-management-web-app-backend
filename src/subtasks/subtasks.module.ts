import { Module } from '@nestjs/common';
// Connect entity to parent module
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubtasksService } from './subtasks.service';
import { SubtasksController } from './subtasks.controller';
import { Subtask } from './subtask.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subtask])],
  providers: [SubtasksService],
  controllers: [SubtasksController],
})
export class SubtasksModule {}
