import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ example: '2026-07-01' })
  @IsNotEmpty({ message: "La date d'arrivée est obligatoire" })
  @IsString({ message: "La date d'arrivée doit être une chaîne (ex: 2026-07-01)" })
  arrivee: string;

  @ApiProperty({ example: '2026-07-05' })
  @IsNotEmpty({ message: 'La date de départ est obligatoire' })
  @IsString({ message: 'La date de départ doit être une chaîne (ex: 2026-07-05)' })
  depart: string;

  @ApiProperty({ example: 2 })
  @IsNotEmpty({ message: 'Le nombre de personnes est obligatoire' })
  @IsNumber({}, { message: 'Le nombre de personnes doit être un nombre' })
  @Min(1, { message: 'Minimum 1 personne' })
  nbPersonnes: number;

  @ApiProperty({ example: 1, description: 'ID du user' })
  @IsNotEmpty({ message: "L'ID de l'utilisateur est obligatoire" })
  @IsNumber({}, { message: "L'ID de l'utilisateur doit être un nombre" })
  userId: number;

  @ApiProperty({ example: 1, description: 'ID de la chambre' })
  @IsNotEmpty({ message: "L'ID de la chambre est obligatoire" })
  @IsNumber({}, { message: "L'ID de la chambre doit être un nombre" })
  chambreId: number;
}

export class UpdateReservationDto {
  @ApiProperty({ example: '2026-07-01', required: false })
  @IsOptional()
  @IsString({ message: "La date d'arrivée doit être une chaîne" })
  arrivee?: string;

  @ApiProperty({ example: '2026-07-05', required: false })
  @IsOptional()
  @IsString({ message: 'La date de départ doit être une chaîne' })
  depart?: string;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Le nombre de personnes doit être un nombre' })
  @Min(1)
  nbPersonnes?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber({}, { message: "L'ID de l'utilisateur doit être un nombre" })
  userId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber({}, { message: "L'ID de la chambre doit être un nombre" })
  chambreId?: number;

  @ApiProperty({ example: 'Confirmée', required: false })
  @IsOptional()
  @IsString({ message: 'Le statut doit être une chaîne' })
  statut?: string;
}