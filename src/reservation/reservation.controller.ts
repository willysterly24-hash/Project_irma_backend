import { Controller, Get, Post, Put, Patch, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto, UpdateReservationDto } from './reservation.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Reservations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reservation')
export class ReservationController {

  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les réservations' })
  findAll() {
    return this.reservationService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: "Récupérer les réservations d'un user" })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.reservationService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une réservation par ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une réservation' })
  create(@Body() dto: CreateReservationDto) {
    return this.reservationService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une réservation' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReservationDto) {
    return this.reservationService.update(id, dto);
  }

  @Patch(':id/confirmer')
  @ApiOperation({ summary: 'Confirmer une réservation' })
  confirmer(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.confirmer(id);
  }

  @Patch(':id/annuler')
  @ApiOperation({ summary: 'Annuler une réservation' })
  annuler(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.annuler(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une réservation' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.delete(id);
  }
}