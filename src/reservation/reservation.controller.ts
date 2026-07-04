import { Controller, Get, Post, Put, Patch, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto, UpdateReservationDto } from './reservation.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/user.entity';

@ApiTags('Reservations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reservation')
export class ReservationController {

  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Récupérer toutes les réservations (admin)' })
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
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Modifier une réservation (admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReservationDto) {
    return this.reservationService.update(id, dto);
  }

  @Patch(':id/confirmer')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Confirmer une réservation (admin)' })
  confirmer(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.confirmer(id);
  }

  @Patch(':id/annuler')
  @ApiOperation({ summary: 'Annuler une réservation' })
  annuler(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.annuler(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Supprimer une réservation (admin)' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.delete(id);
  }
}