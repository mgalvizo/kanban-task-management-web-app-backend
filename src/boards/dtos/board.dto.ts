import { Expose } from 'class-transformer';

// List all the properties to expose to the outside world
export class BoardDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  userId: number;
}
