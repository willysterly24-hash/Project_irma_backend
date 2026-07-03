import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Chambre } from '../chambre/chambre.entity';

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  ville: string;

  @Column()
  etoiles: number;

  @Column({ default: 0 })
  chambres: number;

  @Column({ default: 'Actif' })
  statut: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  photos: string[];

  @Column({ type: 'json', nullable: true })
  equipements: {
    piscine: boolean;
    plage: boolean;
    parking: boolean;
    spa: boolean;
    restaurant: boolean;
    wifi: boolean;
  };

  @OneToMany(() => Chambre, (chambre) => chambre.hotel)
  chambresList: Chambre[];
}