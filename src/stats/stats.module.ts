import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from '../hotel/hotel.entity';
import { Chambre } from '../chambre/chambre.entity';
import { Reservation } from '../reservation/reservation.entity';
import { User } from '../user/user.entity';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hotel, Chambre, Reservation, User]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}