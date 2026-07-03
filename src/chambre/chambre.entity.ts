import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Hotel } from '../hotel/hotel.entity';

export enum TypeChambre {
  STANDARD = 'Standard',
  LUXE = 'Luxe',
  SUITE = 'Suite',
}

@Entity()
export class Chambre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TypeChambre, default: TypeChambre.STANDARD })
  type: TypeChambre;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  prix: number;

  @Column({ default: true })
  dispo: boolean;

  @Column({ default: 1 })
  nbLits: number;

  @Column({ default: 2 })
  nbPersonnes: number;

  @Column({ default: 20 })
  surface: number;

  @Column({ type: 'json', nullable: true })
  photos: string[];

  @Column({ type: 'json', nullable: true })
  equipements: {
    wifi: boolean;
    clim: boolean;
    tv: boolean;
    minibar: boolean;
    balcon: boolean;
    vueMer: boolean;
    jacuzzi: boolean;
  };

  @ManyToOne(() => Hotel, (hotel) => hotel.id, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;
}