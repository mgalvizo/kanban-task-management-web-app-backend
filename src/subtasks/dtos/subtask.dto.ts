import { Expose, Transform } from 'class-transformer';

export class SubtaskDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  isDone: boolean;

  @Expose()
  taskId: number;
}
