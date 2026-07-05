import { Controller, Get, Query, UseGuards, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import axios from 'axios';

// Nominatim (OpenStreetMap) — API de géocodage gratuite, sans clé.
// Politique d'usage : 1 requête/sec max, User-Agent obligatoire.
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

@ApiTags('Géocodage (API Externe)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('geo')
export class GeoController {

  @Get('geocode')
  @ApiOperation({ summary: "Coordonnées GPS d'une ville (OpenStreetMap Nominatim)" })
  @ApiQuery({ name: 'ville', example: 'Dakar' })
  async geocode(@Query('ville') ville: string) {
    if (!ville || ville.trim().length === 0) {
      throw new BadRequestException('Le paramètre "ville" est requis');
    }

    try {
      const { data } = await axios.get(NOMINATIM_URL, {
        params: {
          q: ville,
          format: 'json',
          limit: 1,
        },
        headers: {
          'User-Agent': 'IRMA-Hotel-App/1.0',
        },
      });

      if (!data || data.length === 0) {
        throw new NotFoundException(`Coordonnées introuvables pour "${ville}"`);
      }

      return {
        ville,
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        nomComplet: data[0].display_name,
      };
    } catch (e: any) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException('Erreur lors de la géolocalisation de la ville');
    }
  }
}
