import { Expose, Transform } from 'class-transformer';
import { Board } from 'src/boards/board.entity';

export class ListDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  boardId: number;
}
