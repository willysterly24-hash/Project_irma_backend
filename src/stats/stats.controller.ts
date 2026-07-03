import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Stats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stats')
export class StatsController {

  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les statistiques' })
  getStats() {
    return this.statsService.getStats();
  }
}