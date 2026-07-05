import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favori } from './favori.entity';

@Injectable()
export class FavoriService {
  constructor(
    @InjectRepository(Favori)
    private favoriRepository: Repository<Favori>,
  ) {}

  async create(userId: number, hotelId: number): Promise<Favori> {
    const existing = await this.favoriRepository.findOne({
      where: { user: { id: userId }, hotel: { id: hotelId } },
    });
    if (existing) {
      throw new ConflictException('Cet hôtel est déjà dans vos favoris.');
    }
    const favori = this.favoriRepository.create({
      user: { id: userId } as any,
      hotel: { id: hotelId } as any,
    });
    return this.favoriRepository.save(favori);
  }

  async findAllByUser(userId: number): Promise<Favori[]> {
    return this.favoriRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(userId: number, hotelId: number): Promise<void> {
    const favori = await this.favoriRepository.findOne({
      where: { user: { id: userId }, hotel: { id: hotelId } },
    });
    if (!favori) {
      throw new NotFoundException('Favori introuvable.');
    }
    await this.favoriRepository.remove(favori);
  }
}