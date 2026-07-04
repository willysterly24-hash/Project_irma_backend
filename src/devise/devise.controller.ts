import { Controller, Get, Query, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import axios from 'axios';

// open.er-api.com — API de taux de change gratuite, sans clé, mise à jour quotidienne.
const EXCHANGE_RATE_URL = 'https://open.er-api.com/v6/latest';

@ApiTags('Devise (API Externe)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('devise')
export class DeviseController {

  @Get('taux')
  @ApiOperation({ summary: 'Taux de change à partir d\'une devise de base (ExchangeRate API)' })
  @ApiQuery({ name: 'base', required: false, example: 'XOF' })
  async getTaux(@Query('base') base: string = 'XOF') {
    try {
      const { data } = await axios.get(`${EXCHANGE_RATE_URL}/${base.toUpperCase()}`);

      if (data.result !== 'success') {
        throw new InternalServerErrorException('Réponse invalide de l\'API de change');
      }

      return {
        base: data.base_code,
        dateMaj: data.time_last_update_utc,
        taux: data.rates,
      };
    } catch (e: any) {
      if (e instanceof InternalServerErrorException) throw e;
      throw new InternalServerErrorException('Erreur lors de la récupération des taux de change');
    }
  }
}
