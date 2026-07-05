import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // Register — créer un nouveau compte
  async register(name: string, email: string, password: string) {
    // Vérifier si l'email est déjà utilisé
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe avant de sauvegarder
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await this.userService.create({
      name,
      email,
      password: hashedPassword,
    });

    // Retourner le token directement après inscription
    return this.generateToken(user);
  }

  // Login — vérifier les credentials et retourner un token
  async login(email: string, password: string) {
    // Vérifier si l'utilisateur existe
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Vérifier si le compte est bloqué
    if (user.statut === 'Bloqué') {
      throw new UnauthorizedException('Ce compte est bloqué');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Retourner le token
    return this.generateToken(user);
  }

  // Générer le token JWT
  private generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}