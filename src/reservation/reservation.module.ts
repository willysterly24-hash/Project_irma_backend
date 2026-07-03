import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { UserModule } from '../user/user.module';
import { ChambreModule } from '../chambre/chambre.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    UserModule,    // 👈 pour accéder à UserService
    ChambreModule, // 👈 pour accéder à ChambreService
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}