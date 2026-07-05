import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from './hotel.entity';
import { CreateHotelDto } from './hotel.dto';
import { UpdateHotelDto } from './hotel.dto';

@Injectable()
export class HotelService {

  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
  ) {}

  // Récupérer tous les hôtels
  findAll(): Promise<Hotel[]> {
    return this.hotelRepository.find();
  }

  // Récupérer un hôtel par ID
  async findOne(id: number): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOneBy({ id });
    if (!hotel) {
      throw new NotFoundException(`Hôtel avec l'ID ${id} introuvable`);
    }
    return hotel;
  }

  // Créer un hôtel
  async create(dto: CreateHotelDto): Promise<Hotel> {
    const hotel = this.hotelRepository.create(dto);
    return this.hotelRepository.save(hotel);
  }

  // Modifier un hôtel
  async update(id: number, dto: UpdateHotelDto): Promise<Hotel> {
    await this.findOne(id); // vérifie que l'hôtel existe
    await this.hotelRepository.update(id, dto);
    return this.findOne(id);
  }

  // Supprimer un hôtel
  async delete(id: number): Promise<void> {
    await this.findOne(id); // vérifie que l'hôtel existe
    await this.hotelRepository.delete(id);
  }

  // Ajouter des photos (max 4)
  async addPhotos(id: number, urls: string[]): Promise<Hotel> {
    const hotel = await this.findOne(id);
    const current = hotel.photos || [];
    const updated = [...current, ...urls].slice(0, 4);
    await this.hotelRepository.update(id, { photos: updated });
    return this.findOne(id);
  }

  // Supprimer une photo précise
  async removePhoto(id: number, url: string): Promise<Hotel> {
    const hotel = await this.findOne(id);
    const updated = (hotel.photos || []).filter(p => p !== url);
    await this.hotelRepository.update(id, { photos: updated });
    return this.findOne(id);
  }
}