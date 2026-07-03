import { IsInt } from 'class-validator';

export class CreateFavoriDto {
  @IsInt()
  hotelId: number;
}