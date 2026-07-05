import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offre } from './offre.entity';
import { CreateOffreDto } from './create-offre.dto';
import { UpdateOffreDto } from './update-offre.dto';

@Injectable()
export class OffreService {

  constructor(
    @InjectRepository(Offre)
    private offreRepository: Repository<Offre>,
  ) {}

  async create(data: CreateOffreDto): Promise<Offre> {
    const { chambreId, ...rest } = data;
    const offre = this.offreRepository.create({
      ...rest,
      chambre: { id: chambreId } as any,
    });
    return this.offreRepository.save(offre);
  }

  async findAll(): Promise<Offre[]> {
    return this.offreRepository.find({
      order: { id: 'DESC' },
    });
  }

  async update(id: number, data: UpdateOffreDto): Promise<Offre | null> {
    const { chambreId, ...rest } = data;
    const updateData: any = { ...rest };
    if (chambreId) {
      updateData.chambre = { id: chambreId };
    }
    const offre = await this.offreRepository.findOneBy({ id });
    if (!offre) {
      throw new NotFoundException('Offre introuvable');
    }
    await this.offreRepository.save({ ...offre, ...updateData });
    return this.offreRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<void> {
    await this.offreRepository.delete(id);
  }
}