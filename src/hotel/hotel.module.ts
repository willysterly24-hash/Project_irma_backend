import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './hotel.entity';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel])],
  controllers: [HotelController],
  providers: [HotelService],
  exports: [HotelService], // 👈 ChambreService en aura besoin plus tard
})
export class HotelModule {}