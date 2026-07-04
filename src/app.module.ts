import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module'; 
import { HotelModule } from './hotel/hotel.module'; 
import { ChambreModule } from './chambre/chambre.module'; 
import { ReservationModule } from './reservation/reservation.module';
import { StatsModule } from './stats/stats.module'; 
import { AvisModule } from './avis/avis.module';
import { OffreModule } from './offre/offre.module';
import { MeteoModule } from './meteo/meteo.module';
import { FavoriModule } from './favori/favori.module';
import { GeoModule } from './geo/geo.module';
import { DeviseModule } from './devise/devise.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'irma_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    UserModule,
    AuthModule,
    HotelModule,
    ChambreModule,
    ReservationModule,
    StatsModule,
    AvisModule,
    OffreModule,
    MeteoModule,
    FavoriModule,
    GeoModule,
    DeviseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
