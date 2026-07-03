import { Controller, Get, Param, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import axios from 'axios';

@ApiTags('Pays (API Externe)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pays')
export class PaysController {

  @Get()
  @ApiOperation({ summary: 'Récupérer la liste des pays (REST Countries)' })
  async findAll() {
    const response = await axios.get('https://restcountries.com/v5/all?fields=name,capital,region,flags,cca2');
    const data = Array.isArray(response.data) ? response.data : response.data.data;
    if (!data) throw new InternalServerErrorException('Réponse API invalide');
    return data.map((p: any) => ({
      code: p.cca2,
      nom: p.name?.common,
      capitale: p.capital?.[0] ?? 'N/A',
      region: p.region,
      drapeau: p.flags?.png,
    }));
  }

  @Get(':code')
  @ApiOperation({ summary: 'Infos d\'un pays par code ISO 2 (ex: FR, SN)' })
  async findOne(@Param('code') code: string) {
    const response = await axios.get(
  `https://restcountries.com/v5/alpha/${code.toUpperCase()}?fields=name,capital,population,region,flags`
);
    const p = response.data?.data ?? response.data;
    return {
      code: code.toUpperCase(),
      nom: p.name?.common,
      capitale: p.capital?.[0] ?? 'N/A',
      population: p.population,
      region: p.region,
      drapeau: p.flags?.png,
    };
  }
}