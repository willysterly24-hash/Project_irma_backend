import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/user.entity';

@ApiTags('Stats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('stats')
export class StatsController {

  constructor(private readonly statsService: StatsService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Récupérer toutes les statistiques (admin)' })
  getStats() {
    return this.statsService.getStats();
  }
}