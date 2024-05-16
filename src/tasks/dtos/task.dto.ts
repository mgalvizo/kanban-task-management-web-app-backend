import { Expose, Transform } from 'class-transformer';

export class TaskDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  // Generate a new property with the list id related to this task
  // "obj" is a reference to the original entity
  @Transform(({ obj }) => obj.list.id)
  @Expose()
  listId: number;
}
