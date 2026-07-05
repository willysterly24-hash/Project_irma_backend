import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Chambre } from '../chambre/chambre.entity';

@Entity()
export class Offre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  badge: string;

  @Column()
  titre: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  image: string;

  @Column({ type: 'date' })
  expiration: string;

  @Column({ type: 'int', default: 0 })
  pourcentageReduction: number;

  @ManyToOne(() => Chambre, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chambreId' })
  chambre: Chambre;
}