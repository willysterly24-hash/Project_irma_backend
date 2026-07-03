import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favori } from './favori.entity';
import { FavoriService } from './favori.service';
import { FavoriController } from './favori.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Favori])],
  controllers: [FavoriController],
  providers: [FavoriService],
})
export class FavoriModule {}