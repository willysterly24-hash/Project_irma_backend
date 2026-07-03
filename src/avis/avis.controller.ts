import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { AvisService } from './avis.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Avis')
@Controller('avis')
export class AvisController {

  constructor(private readonly avisService: AvisService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un avis' })
  create(@Body() body: { nom: string; hotel: string; commentaire: string; note: number }) {
    return this.avisService.create(body.nom, body.hotel, body.commentaire, body.note);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les avis' })
  findAll() {
    return this.avisService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un avis' })
  delete(@Param('id') id: string) {
    return this.avisService.delete(+id);
  }
}