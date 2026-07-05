import { Controller, Get, Param, UseGuards, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import axios from 'axios';

const API_KEY = '7a9e1cf01bae170a1756b71897a7c781';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

@ApiTags('Météo (API Externe)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('meteo')
export class MeteoController {

  @Get(':ville')
  @ApiOperation({ summary: 'Météo actuelle d\'une ville (OpenWeather)' })
  @ApiParam({ name: 'ville', example: 'Dakar' })
  async getMeteo(@Param('ville') ville: string) {
    try {
      const { data } = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: ville,
          appid: API_KEY,
          units: 'metric',
          lang: 'fr',
        },
      });
      return {
        ville: data.name,
        pays: data.sys.country,
        temperature: data.main.temp,
        ressentie: data.main.feels_like,
        humidite: data.main.humidity,
        description: data.weather[0].description,
        icone: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        vent: data.wind.speed,
      };
    } catch (e: any) {
      if (e.response?.status === 404) {
        throw new NotFoundException(`Ville "${ville}" introuvable`);
      }
      throw new InternalServerErrorException('Erreur lors de la récupération de la météo');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Météo des principales villes hôtelières' })
  async getMeteoVilles() {
    const villes = ['Dakar', 'Paris', 'Dubai', 'New York', 'London'];
    const results = await Promise.allSettled(
      villes.map(ville =>
        axios.get(`${BASE_URL}/weather`, {
          params: { q: ville, appid: API_KEY, units: 'metric', lang: 'fr' },
        })
      )
    );
    return results
      .filter(r => r.status === 'fulfilled')
      .map((r: any) => ({
        ville: r.value.data.name,
        pays: r.value.data.sys.country,
        temperature: r.value.data.main.temp,
        description: r.value.data.weather[0].description,
        icone: `https://openweathermap.org/img/wn/${r.value.data.weather[0].icon}@2x.png`,
      }));
  }
}
