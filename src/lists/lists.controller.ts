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

// `GET boards/:boardId/lists` Get all lists for a specific board
// `GET /lists/:id` Get a single list by ID
// `POST /boards/:boardId/lists` Create a new list in a specific board
// `PATCH /lists/:id` Update a list by ID
// `DELETE /lists/:id` Delete a list by ID

@Controller('lists')
@Serialize(ListDto)
export class ListsController {
  constructor(private readonly listsService: ListsService) {}
}
