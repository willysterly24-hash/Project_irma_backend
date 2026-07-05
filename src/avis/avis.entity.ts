import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Avis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  hotel: string;

  @Column()
  commentaire: string;

  @Column()
  note: number;

  @CreateDateColumn()
  createdAt: Date;

  // Lien optionnel vers le compte — nullable pour ne pas casser les avis existants (créés avant ce lien)
  // eager désactivé : le service ne sélectionne que les champs publics nécessaires (voir avis.service.ts)
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User | null;
}