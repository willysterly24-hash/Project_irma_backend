import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { UserService } from '../user/user.service';
import { ChambreService } from '../chambre/chambre.service';
import { CreateReservationDto, UpdateReservationDto } from './reservation.dto';

@Injectable()
export class ReservationService {

  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private userService: UserService,
    private chambreService: ChambreService,
  ) {}

  findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find();
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOneBy({ id });
    if (!reservation) {
      throw new NotFoundException(`Réservation avec l'ID ${id} introuvable`);
    }
    return reservation;
  }

  async findByUser(userId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { user: { id: userId } },
    });
  }

  /**
   * Calcule le nombre de nuits entre deux dates (format YYYY-MM-DD)
   */
  private calculerNuits(arrivee: string, depart: string): number {
    const dateArrivee = new Date(arrivee);
    const dateDepart = new Date(depart);

    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);

    if (dateArrivee < aujourdhui) {
      throw new BadRequestException(
        'La date d\'arrivée ne peut pas être dans le passé',
      );
    }

    const diffMs = dateDepart.getTime() - dateArrivee.getTime();
    const nuits = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (nuits <= 0) {
      throw new BadRequestException(
        'La date de départ doit être postérieure à la date d\'arrivée',
      );
    }

    return nuits;
  }

  async create(dto: CreateReservationDto): Promise<Reservation> {
    const user = await this.userService.findOne(dto.userId);
    const chambre = await this.chambreService.findOne(dto.chambreId);

    if (!chambre.dispo) {
      throw new BadRequestException('Cette chambre n\'est pas disponible');
    }

    if (dto.nbPersonnes > chambre.nbPersonnes) {
      throw new BadRequestException(
        `Cette chambre accueille au maximum ${chambre.nbPersonnes} personne(s)`,
      );
    }

    const nuits = this.calculerNuits(dto.arrivee, dto.depart);
    const montant = Number(chambre.prix) * nuits;

    const reservation = this.reservationRepository.create({
      arrivee: dto.arrivee,
      depart: dto.depart,
      nbPersonnes: dto.nbPersonnes,
      montant: montant,
      user: user,
      chambre: chambre,
    });

    const saved = await this.reservationRepository.save(reservation);
    await this.userService.incrementReservations(dto.userId);
    await this.chambreService.setDispo(dto.chambreId, false); // 👈 chambre indispo
    return saved;
  }

  async confirmer(id: number): Promise<Reservation> {
    const reservation = await this.findOne(id);
    reservation.statut = 'Confirmé';
    return this.reservationRepository.save(reservation);
  }

  async annuler(id: number): Promise<Reservation> {
    const reservation = await this.findOne(id);
    reservation.statut = 'Annulé';
    await this.chambreService.setDispo(reservation.chambre.id, true); // 👈 chambre dispo
    return this.reservationRepository.save(reservation);
  }

  async update(id: number, dto: UpdateReservationDto): Promise<Reservation> {
    const reservation = await this.findOne(id);
    const updateData: any = {};

    if (dto.userId) updateData.user = await this.userService.findOne(dto.userId);
    if (dto.chambreId) updateData.chambre = await this.chambreService.findOne(dto.chambreId);
    if (dto.statut) updateData.statut = dto.statut;

    const nouvelleChambre = updateData.chambre ?? reservation.chambre;
    const nouvelleArrivee = dto.arrivee ?? reservation.arrivee;
    const nouveauDepart = dto.depart ?? reservation.depart;
    const nouveauNbPersonnes = dto.nbPersonnes ?? reservation.nbPersonnes;

    if (nouveauNbPersonnes > nouvelleChambre.nbPersonnes) {
      throw new BadRequestException(
        `Cette chambre accueille au maximum ${nouvelleChambre.nbPersonnes} personne(s)`,
      );
    }

    // Recalcule le montant si dates ou chambre changent
    if (dto.arrivee || dto.depart || dto.chambreId) {
      const nuits = this.calculerNuits(nouvelleArrivee, nouveauDepart);
      updateData.montant = Number(nouvelleChambre.prix) * nuits;
    }

    if (dto.arrivee) updateData.arrivee = dto.arrivee;
    if (dto.depart) updateData.depart = dto.depart;
    if (dto.nbPersonnes) updateData.nbPersonnes = dto.nbPersonnes;

    await this.reservationRepository.save({ id, ...updateData });
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.reservationRepository.delete(id);
  }
}