import { Expose, Transform } from 'class-transformer';

export class ListDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  // Generate a new property with the board id related to this list
  // "obj" is a reference to the original entity
  @Transform(({ obj }) => obj.board.id)
  @Expose()
  boardId: number;
}
