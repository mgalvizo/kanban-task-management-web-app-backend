import { IsString, IsNotEmpty } from 'class-validator';

// Shape of the body in the request
export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
