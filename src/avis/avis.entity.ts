import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

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
}