import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chambre } from './chambre.entity';
import { ChambreService } from './chambre.service';
import { ChambreController } from './chambre.controller';
import { HotelModule } from '../hotel/hotel.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chambre]),
    HotelModule, // 👈 pour accéder à HotelService
  ],
  controllers: [ChambreController],
  providers: [ChambreService],
  exports: [ChambreService], // 👈 ReservationService en aura besoin
})
export class ChambreModule {}