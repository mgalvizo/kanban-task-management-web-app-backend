import { Expose } from 'class-transformer';

export class ListDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  boardId: number;
}
