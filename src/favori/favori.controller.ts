import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FavoriService } from './favori.service';
import { CreateFavoriDto } from './create-favori.dto';

@ApiTags('Favoris')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favori')
export class FavoriController {
  constructor(private readonly favoriService: FavoriService) {}

  @Post()
  @ApiOperation({ summary: 'Ajouter un hôtel aux favoris' })
  create(@Req() req: any, @Body() dto: CreateFavoriDto) {
    return this.favoriService.create(req.user.id, dto.hotelId);
  }

  @Get()
  @ApiOperation({ summary: "Récupérer les favoris de l'utilisateur connecté" })
  findAll(@Req() req: any) {
    return this.favoriService.findAllByUser(req.user.id);
  }

  @Delete(':hotelId')
  @ApiOperation({ summary: 'Retirer un hôtel des favoris' })
  remove(@Req() req: any, @Param('hotelId', ParseIntPipe) hotelId: number) {
    return this.favoriService.remove(req.user.id, hotelId);
  }
}