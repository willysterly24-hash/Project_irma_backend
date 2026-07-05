import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Chambre } from '../chambre/chambre.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  arrivee: string;

  @Column({ type: 'date' })
  depart: string;

  @Column({ default: 1 })
  nbPersonnes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montant: number;

  @Column({ default: 'En attente' })
  statut: string;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Chambre, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chambreId' })
  chambre: Chambre;
}