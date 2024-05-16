import { IsString } from 'class-validator';

// Shape of the body in the request
export class CreateBoardDto {
  @IsString()
  name: string;
}
