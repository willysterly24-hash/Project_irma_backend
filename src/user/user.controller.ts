import {
  Controller, Get, Put, Delete, Post,
  Param, Body, ParseIntPipe, Request, UseGuards,
  UploadedFile, UseInterceptors, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserService } from './user.service';
import { User, Role } from './user.entity';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
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

  // PUT /user/me — modifier son propre profil (tous rôles connectés)
  @Put('me')
  @ApiOperation({ summary: 'Modifier son propre profil (nom, email, téléphone)' })
  updateMe(
    @Request() req: any,
    @Body() data: { name?: string; email?: string; telephone?: string },
  ): Promise<User> {
    return this.userService.updateSelf(req.user.id, data);
  }

  // PUT /user/me/password — changer son propre mot de passe
  @Put('me/password')
  @ApiOperation({ summary: 'Changer son propre mot de passe' })
  async changeMyPassword(
    @Request() req: any,
    @Body() data: { currentPassword: string; newPassword: string },
  ) {
    if (!data.newPassword || data.newPassword.length < 6) {
      throw new BadRequestException('Le nouveau mot de passe doit contenir au moins 6 caractères');
    }
    await this.userService.changePassword(req.user.id, data.currentPassword, data.newPassword);
    return { message: 'Mot de passe modifié avec succès' };
  }

  // POST /user/me/photo — upload de sa propre photo de profil
  @Post('me/photo')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiOperation({ summary: 'Uploader sa photo de profil' })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'user-' + unique + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        return cb(new Error('Seules les images jpg/png/webp sont acceptées'), false);
      }
      cb(null, true);
    },
  }))
  async uploadMyPhoto(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier reçu');
    }
    const url = `/uploads/${file.filename}`;
    const user = await this.userService.updatePhoto(req.user.id, url);
    return { photo: user.photo };
  }

  // DELETE /user/me — supprimer son propre compte
  @Delete('me')
  @ApiOperation({ summary: 'Supprimer son propre compte' })
  async deleteMe(@Request() req: any) {
    await this.userService.deleteSelf(req.user.id);
    return { message: 'Compte supprimé' };
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
