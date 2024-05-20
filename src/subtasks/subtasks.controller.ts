import { Controller, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { SubtaskDto } from './dtos/subtask.dto';
import { SubtasksService } from './subtasks.service';
import { UpdateSubtaskDto } from './dtos/update-subtask.dto';

@Controller('subtasks')
@Serialize(SubtaskDto)
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Get('/:id')
  getSubtask(@Param('id') id: string) {
    return this.subtasksService.findOne(Number(id));
  }

  @Patch('/:id')
  updateSubtask(@Param('id') id: string, @Body() body: UpdateSubtaskDto) {
    return this.subtasksService.update(Number(id), body);
  }

  @Delete('/:id')
  removeSubtask(@Param('id') id: string) {
    return this.subtasksService.remove(Number(id));
  }
}
