import { Module } from '@nestjs/common';
import { MeteoController } from './meteo.controller';

@Module({
  controllers: [MeteoController],
})
export class MeteoModule {}
