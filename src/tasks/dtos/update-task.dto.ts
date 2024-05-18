import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // Updates the foreign key
  @IsInt()
  @IsNotEmpty()
  listId: number;
}
