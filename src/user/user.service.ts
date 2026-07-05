import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Récupérer tous les utilisateurs
  findAll(): Promise<User[]> {
  return this.userRepository.find({
    where: { role: Role.USER }
  });
}
  

  // Récupérer un utilisateur par son ID
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }
    return user;
  }

  // Récupérer un utilisateur par son email (utilisé par AuthService)
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  // Créer un utilisateur (utilisé par AuthService)
  async create(userData: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  // Modifier un utilisateur
  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    return this.findOne(id);
  }

  // Modifier son propre profil (nom, email, téléphone) — utilisé via /user/me
  async updateSelf(id: number, data: { name?: string; email?: string; telephone?: string }): Promise<User> {
    if (data.email) {
      const existing = await this.findByEmail(data.email);
      if (existing && existing.id !== id) {
        throw new ConflictException('Cet email est déjà utilisé par un autre compte');
      }
    }
    await this.userRepository.update(id, data);
    return this.findOne(id);
  }

  // Changer son mot de passe (vérifie l'ancien avant de le remplacer)
  async changePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Mot de passe actuel incorrect');
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(id, { password: hashed });
  }

  // Mettre à jour la photo de profil
  async updatePhoto(id: number, photoUrl: string): Promise<User> {
    await this.userRepository.update(id, { photo: photoUrl });
    return this.findOne(id);
  }

  // Supprimer son propre compte
  async deleteSelf(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  // Bloquer ou débloquer un utilisateur
  async toggleBlock(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.statut = user.statut === 'Actif' ? 'Bloqué' : 'Actif';
    return this.userRepository.save(user);
  }

  // Supprimer un utilisateur
  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  // Incrémenter le compteur de réservations
  async incrementReservations(id: number): Promise<void> {
    const user = await this.findOne(id);
    user.reservations += 1;
    await this.userRepository.save(user);
  }
}