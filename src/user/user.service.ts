import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from './user.entity';

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