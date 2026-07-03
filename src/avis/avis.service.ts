import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avis } from './avis.entity';

@Injectable()
export class AvisService {

  constructor(
    @InjectRepository(Avis)
    private avisRepository: Repository<Avis>,
  ) {}

  async create(nom: string, hotel: string, commentaire: string, note: number): Promise<Avis> {
    const avis = this.avisRepository.create({ nom, hotel, commentaire, note });
    return this.avisRepository.save(avis);
  }

  async findAll(): Promise<Avis[]> {
    return this.avisRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async delete(id: number): Promise<void> {
    await this.avisRepository.delete(id);
  }
}