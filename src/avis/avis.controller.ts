import { Controller, Post, Get, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { AvisService } from './avis.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/user.entity';

@ApiTags('Avis')
@Controller('avis')
export class AvisController {

  constructor(private readonly avisService: AvisService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un avis (lié au compte connecté)' })
  create(@Request() req: any, @Body() body: { nom: string; hotel: string; commentaire: string; note: number }) {
    return this.avisService.create(body.nom, body.hotel, body.commentaire, body.note, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les avis' })
  findAll() {
    return this.avisService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un avis (admin)' })
  delete(@Param('id') id: string) {
    return this.avisService.delete(+id);
  }
}