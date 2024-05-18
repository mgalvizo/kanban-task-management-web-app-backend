import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateSubtaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  isDone: boolean;
}
