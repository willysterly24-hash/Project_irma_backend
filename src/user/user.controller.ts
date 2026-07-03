import {
  Controller, Get, Put, Delete,
  Param, Body, ParseIntPipe, Request, UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, Role } from './user.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  // GET /user/me — profil du user connecté (tous rôles)
  @Get('me')
  @ApiOperation({ summary: 'Récupérer le profil du user connecté' })
  getMe(@Request() req: any) {
    return this.userService.findOne(req.user.id);
  }

  // GET /user — liste tous les utilisateurs (admin seulement)
  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Récupérer tous les utilisateurs (admin)' })
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // GET /user/:id — admin seulement
  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Récupérer un utilisateur par ID (admin)' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  // PUT /user/:id — admin seulement
  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Modifier un utilisateur (admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: Partial<User>,
  ): Promise<User> {
    return this.userService.update(id, userData);
  }

  // PUT /user/:id/toggle-block — admin seulement
  @Put(':id/toggle-block')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Bloquer ou débloquer un utilisateur (admin)' })
  toggleBlock(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.toggleBlock(id);
  }

  // DELETE /user/:id — admin seulement
  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Supprimer un utilisateur (admin)' })
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.delete(id);
  }
}
