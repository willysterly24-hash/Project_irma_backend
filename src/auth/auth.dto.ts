import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Admin IRMA' })
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  name: string;

  @ApiProperty({ example: 'admin@irma.com' })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: "L'email est obligatoire" })
  email: string;

  @ApiProperty({ example: 'admin123' })
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'admin@irma.com' })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: "L'email est obligatoire" })
  email: string;

  @ApiProperty({ example: 'admin123' })
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  password: string;
}
