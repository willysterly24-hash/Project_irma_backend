import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chambre } from './chambre.entity';
import { HotelService } from '../hotel/hotel.service';
import { CreateChambreDto, UpdateChambreDto } from './chambre.dto';

@Injectable()
export class ChambreService {

  constructor(
    @InjectRepository(Chambre)
    private chambreRepository: Repository<Chambre>,
    private hotelService: HotelService,
  ) {}

  findAll(dispo?: boolean): Promise<Chambre[]> {
    if (dispo !== undefined) {
      return this.chambreRepository.find({ where: { dispo } });
    }
    return this.chambreRepository.find();
  }

  async findOne(id: number): Promise<Chambre> {
    const chambre = await this.chambreRepository.findOneBy({ id });
    if (!chambre) {
      throw new NotFoundException(`Chambre avec l'ID ${id} introuvable`);
    }
    return chambre;
  }

  async findByHotel(hotelId: number): Promise<Chambre[]> {
    return this.chambreRepository.find({
      where: { hotel: { id: hotelId } },
    });
  }

  async create(dto: CreateChambreDto): Promise<Chambre> {
    const hotel = await this.hotelService.findOne(dto.hotelId);
    const chambre = this.chambreRepository.create({
      type: dto.type,
      prix: dto.prix,
      dispo: dto.dispo,
      hotel: hotel,
      nbLits: dto.nbLits,
      nbPersonnes: dto.nbPersonnes,
      surface: dto.surface,
      photos: dto.photos || [],
      equipements: dto.equipements,
    });
    return this.chambreRepository.save(chambre);
  }

  async update(id: number, dto: UpdateChambreDto): Promise<Chambre> {
    await this.findOne(id);

    // On ne construit l'objet qu'avec les champs réellement fournis
    const updateData: Partial<Chambre> = {};

    if (dto.type !== undefined) updateData.type = dto.type;
    if (dto.prix !== undefined) updateData.prix = dto.prix;
    if (dto.dispo !== undefined) updateData.dispo = dto.dispo;
    if (dto.nbLits !== undefined) updateData.nbLits = dto.nbLits;
    if (dto.nbPersonnes !== undefined) updateData.nbPersonnes = dto.nbPersonnes;
    if (dto.surface !== undefined) updateData.surface = dto.surface;
    if (dto.photos !== undefined) updateData.photos = dto.photos as any;
    if (dto.equipements !== undefined) updateData.equipements = dto.equipements as any;

    if (dto.hotelId !== undefined) {
      const hotel = await this.hotelService.findOne(dto.hotelId);
      updateData.hotel = hotel;
    }

    await this.chambreRepository.update(id, updateData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.chambreRepository.delete(id);
  }

  async setDispo(id: number, dispo: boolean): Promise<void> {
    await this.chambreRepository.update(id, { dispo });
  }

  async addPhotos(id: number, urls: string[]): Promise<Chambre> {
    const chambre = await this.findOne(id);
    const current = chambre.photos || [];
    const updated = [...current, ...urls].slice(0, 4);
    await this.chambreRepository.update(id, { photos: updated });
    return this.findOne(id);
  }

  async removePhoto(id: number, url: string): Promise<Chambre> {
    const chambre = await this.findOne(id);
    const updated = (chambre.photos || []).filter(p => p !== url);
    await this.chambreRepository.update(id, { photos: updated });
    return this.findOne(id);
  }
}