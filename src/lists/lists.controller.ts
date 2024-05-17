import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ListDto } from './dtos/list.dto';
import { ListsService } from './lists.service';
import { CreateListDto } from './dtos/create-list.dto';
import { UpdateListDto } from './dtos/update-list.dto';

// `DELETE /lists/:id` Delete a list by ID

@Controller('lists')
@Serialize(ListDto)
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Get('/:id')
  findList(@Param('id') id: string) {
    return this.listsService.findOne(Number(id));
  }

  @Patch('/:id')
  updateList(@Param('id') id: string, @Body() body: UpdateListDto) {
    return this.listsService.update(Number(id), body);
  }

  @Delete('/:id')
  deleteList(@Param('id') id: string) {
    return this.listsService.remove(Number(id));
  }
}
