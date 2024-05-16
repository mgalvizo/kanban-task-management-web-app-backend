import { Expose, Transform } from 'class-transformer';

export class SubtaskDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  isDone: boolean;

  // Generate a new property with the task id related to this subtask
  // "obj" is a reference to the original entity
  @Transform(({ obj }) => obj.task.id)
  @Expose()
  taskId: number;
}
