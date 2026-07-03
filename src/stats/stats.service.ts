import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from '../hotel/hotel.entity';
import { Chambre } from '../chambre/chambre.entity';
import { Reservation } from '../reservation/reservation.entity';
import { User, Role } from '../user/user.entity';

@Injectable()
export class StatsService {

  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,

    @InjectRepository(Chambre)
    private chambreRepository: Repository<Chambre>,

    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getStats() {
    const totalHotels = await this.hotelRepository.count();
    const totalChambres = await this.chambreRepository.count();
    const totalReservations = await this.reservationRepository.count();

    const totalUsers = await this.userRepository.count({
      where: { role: Role.USER }
    });

    const confirmees = await this.reservationRepository.count({
      where: { statut: 'Confirmé' },
    });
    const enAttente = await this.reservationRepository.count({
      where: { statut: 'En attente' },
    });
    const annulees = await this.reservationRepository.count({
      where: { statut: 'Annulé' },
    });

    const usersActifs = await this.userRepository.count({
      where: { statut: 'Actif', role: Role.USER },
    });
    const usersBlockes = await this.userRepository.count({
      where: { statut: 'Bloqué', role: Role.USER },
    });

    const chambresDisponibles = await this.chambreRepository.count({
      where: { dispo: true },
    });

    // Revenus mensuels réels (basés sur les réservations confirmées)
    const moisLabels = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenusParMoisMap: Record<string, number> = {};
    moisLabels.forEach(m => (revenusParMoisMap[m] = 0));

    const reservationsConfirmees = await this.reservationRepository.find({
      where: { statut: 'Confirmé' },
    });

    reservationsConfirmees.forEach(r => {
      const date = new Date(r.arrivee);
      const moisLabel = moisLabels[date.getMonth()];
      revenusParMoisMap[moisLabel] += Number(r.montant);
    });

    const revenusParMois = moisLabels.map(mois => ({
      mois,
      revenus: revenusParMoisMap[mois],
    }));

    // Taux d'occupation réel par hôtel
    const hotelsAvecChambres = await this.hotelRepository.find({
  relations: { chambresList: true },
});
    const occupationParHotel = hotelsAvecChambres.map(h => {
      const total = h.chambresList.length;
      const occupees = h.chambresList.filter(c => !c.dispo).length;
      const taux = total > 0 ? Math.round((occupees / total) * 100) : 0;
      return { hotel: h.nom, taux };
    });

    return {
      totalHotels,
      totalChambres,
      totalReservations,
      totalUsers,
      reservationsParStatut: {
        confirmees,
        enAttente,
        annulees,
      },
      usersParStatut: {
        actifs: usersActifs,
        bloques: usersBlockes,
      },
      chambresDisponibles,
      revenusParMois,
      occupationParHotel,
    };
  }
}