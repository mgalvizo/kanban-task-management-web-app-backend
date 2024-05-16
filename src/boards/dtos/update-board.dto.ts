import { IsString } from 'class-validator';

// Shape of the body in the request
export class UpdateBoardDto {
  @IsString()
  name: string;
}
