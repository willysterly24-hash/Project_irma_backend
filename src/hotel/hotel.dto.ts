import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsObject,
  IsArray,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EquipementsHotelDto {
  @ApiProperty({ example: true, required: false })
  @IsOptional()
  piscine?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  plage?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  parking?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  spa?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  restaurant?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  wifi?: boolean;
}

export class CreateHotelDto {
  @ApiProperty({ example: 'Hotel Terrou-Bi' })
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  nom: string;

  @ApiProperty({ example: 'Dakar' })
  @IsNotEmpty({ message: 'La ville est obligatoire' })
  @IsString({ message: 'La ville doit être une chaîne de caractères' })
  ville: string;

  @ApiProperty({ example: 5 })
  @IsNotEmpty({ message: "Le nombre d'étoiles est obligatoire" })
  @IsNumber({}, { message: 'Les étoiles doivent être un nombre' })
  @Min(1, { message: 'Minimum 1 étoile' })
  @Max(5, { message: 'Maximum 5 étoiles' })
  etoiles: number;

  @ApiProperty({ example: 50 })
  @IsNotEmpty({ message: 'Le nombre de chambres est obligatoire' })
  @IsNumber({}, { message: 'Le nombre de chambres doit être un nombre' })
  @Min(1, { message: 'Minimum 1 chambre' })
  chambres: number;

  @ApiProperty({ example: 'Actif', enum: ['Actif', 'Maintenance', 'Fermé'] })
  @IsNotEmpty({ message: 'Le statut est obligatoire' })
  @IsEnum(['Actif', 'Maintenance', 'Fermé'], {
    message: 'Statut invalide (Actif, Maintenance, Fermé)',
  })
  statut: string;

  @ApiProperty({
    example: 'Un hôtel de luxe face à l\'océan avec vue panoramique',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La description doit être une chaîne de caractères' })
  description?: string;

  @ApiProperty({ example: ['/uploads/hotel-1.jpg'], required: false, type: [String] })
  @IsOptional()
  @IsArray({ message: 'Les photos doivent être un tableau' })
  @IsString({ each: true, message: 'Chaque photo doit être une chaîne de caractères' })
  photos?: string[];

  @ApiProperty({ type: EquipementsHotelDto, required: false })
  @IsOptional()
  @IsObject({ message: 'Les équipements doivent être un objet' })
  @ValidateNested()
  @Type(() => EquipementsHotelDto)
  equipements?: EquipementsHotelDto;
}

export class UpdateHotelDto {
  @ApiProperty({ example: 'Hotel Terrou-Bi', required: false })
  @IsOptional()
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  nom?: string;

  @ApiProperty({ example: 'Dakar', required: false })
  @IsOptional()
  @IsString({ message: 'La ville doit être une chaîne de caractères' })
  ville?: string;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Les étoiles doivent être un nombre' })
  @Min(1)
  @Max(5)
  etoiles?: number;

  @ApiProperty({ example: 50, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Le nombre de chambres doit être un nombre' })
  @Min(1)
  chambres?: number;

  @ApiProperty({
    example: 'Actif',
    enum: ['Actif', 'Maintenance', 'Fermé'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['Actif', 'Maintenance', 'Fermé'], { message: 'Statut invalide' })
  statut?: string;

  @ApiProperty({ example: 'Un hôtel de luxe...', required: false })
  @IsOptional()
  @IsString({ message: 'La description doit être une chaîne de caractères' })
  description?: string;

  @ApiProperty({ example: ['/uploads/hotel-1.jpg'], required: false, type: [String] })
  @IsOptional()
  @IsArray({ message: 'Les photos doivent être un tableau' })
  @IsString({ each: true, message: 'Chaque photo doit être une chaîne de caractères' })
  photos?: string[];

  @ApiProperty({ type: EquipementsHotelDto, required: false })
  @IsOptional()
  @IsObject({ message: 'Les équipements doivent être un objet' })
  @ValidateNested()
  @Type(() => EquipementsHotelDto)
  equipements?: EquipementsHotelDto;
}