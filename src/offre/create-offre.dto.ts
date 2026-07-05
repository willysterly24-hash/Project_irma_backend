import { IsString, IsNotEmpty, IsDateString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateOffreDto {
  @IsString()
  @IsNotEmpty()
  badge: string;

  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsDateString()
  expiration: string;

  @IsInt()
  @Min(1)
  @Max(90)
  pourcentageReduction: number;

  @IsInt()
  chambreId: number;
}