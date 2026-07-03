import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsObject,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TypeChambre } from './chambre.entity';

export class EquipementsChambreDto {
  @ApiProperty({ example: true, required: false })
  @IsOptional()
  wifi?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  clim?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  tv?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  minibar?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  balcon?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  vueMer?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  jacuzzi?: boolean;
}

export class CreateChambreDto {
  @ApiProperty({ example: 'Suite', enum: TypeChambre })
  @IsNotEmpty({ message: 'Le type est obligatoire' })
  @IsEnum(TypeChambre, {
    message: 'Le type doit être Standard, Luxe ou Suite',
  })
  type: TypeChambre;

  @ApiProperty({ example: 75000 })
  @IsNotEmpty({ message: 'Le prix est obligatoire' })
  @IsNumber({}, { message: 'Le prix doit être un nombre' })
  @Min(0, { message: 'Le prix ne peut pas être négatif' })
  prix: number;

  @ApiProperty({ example: true })
  @IsNotEmpty({ message: 'La disponibilité est obligatoire' })
  @IsBoolean({ message: 'La disponibilité doit être un booléen (true/false)' })
  dispo: boolean;

  @ApiProperty({ example: 1, description: "ID de l'hôtel" })
  @IsNotEmpty({ message: "L'ID de l'hôtel est obligatoire" })
  @IsNumber({}, { message: "L'ID de l'hôtel doit être un nombre" })
  hotelId: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty({ message: 'Le nombre de lits est obligatoire' })
  @IsNumber({}, { message: 'Le nombre de lits doit être un nombre' })
  @Min(1, { message: 'Minimum 1 lit' })
  nbLits: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty({ message: 'Le nombre de personnes est obligatoire' })
  @IsNumber({}, { message: 'Le nombre de personnes doit être un nombre' })
  @Min(1, { message: 'Minimum 1 personne' })
  nbPersonnes: number;

  @ApiProperty({ example: 35 })
  @IsNotEmpty({ message: 'La surface est obligatoire' })
  @IsNumber({}, { message: 'La surface doit être un nombre' })
  @Min(1, { message: 'La surface doit être positive' })
  surface: number;

  @ApiProperty({ example: ['/uploads/chambre-1.jpg'], required: false, type: [String] })
  @IsOptional()
  @IsArray({ message: 'Les photos doivent être un tableau' })
  @IsString({ each: true, message: 'Chaque photo doit être une chaîne de caractères' })
  photos?: string[];

  @ApiProperty({ type: EquipementsChambreDto, required: false })
  @IsOptional()
  @IsObject({ message: 'Les équipements doivent être un objet' })
  @ValidateNested()
  @Type(() => EquipementsChambreDto)
  equipements?: EquipementsChambreDto;
}

export class UpdateChambreDto {
  @ApiProperty({ example: 'Suite', enum: TypeChambre, required: false })
  @IsOptional()
  @IsEnum(TypeChambre, {
    message: 'Le type doit être Standard, Luxe ou Suite',
  })
  type?: TypeChambre;

  @ApiProperty({ example: 75000, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Le prix doit être un nombre' })
  @Min(0)
  prix?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: 'La disponibilité doit être un booléen' })
  dispo?: boolean;

  @ApiProperty({ example: 1, required: false, description: "ID de l'hôtel" })
  @IsOptional()
  @IsNumber({}, { message: "L'ID de l'hôtel doit être un nombre" })
  hotelId?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Le nombre de lits doit être un nombre' })
  @Min(1)
  nbLits?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Le nombre de personnes doit être un nombre' })
  @Min(1)
  nbPersonnes?: number;

  @ApiProperty({ example: 35, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'La surface doit être un nombre' })
  @Min(1)
  surface?: number;

  @ApiProperty({ example: ['/uploads/chambre-1.jpg'], required: false, type: [String] })
  @IsOptional()
  @IsArray({ message: 'Les photos doivent être un tableau' })
  @IsString({ each: true, message: 'Chaque photo doit être une chaîne de caractères' })
  photos?: string[];

  @ApiProperty({ type: EquipementsChambreDto, required: false })
  @IsOptional()
  @IsObject({ message: 'Les équipements doivent être un objet' })
  @ValidateNested()
  @Type(() => EquipementsChambreDto)
  equipements?: EquipementsChambreDto;
}