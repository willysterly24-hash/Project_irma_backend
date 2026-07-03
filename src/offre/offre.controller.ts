import {
  Controller, Post, Get, Put, Delete,
  Body, Param, UploadedFile, UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { OffreService } from './offre.service';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { Offre } from './offre.entity';
import { CreateOffreDto } from './create-offre.dto';
import { UpdateOffreDto } from './update-offre.dto';

@ApiTags('Offres')
@Controller('offre')
export class OffreController {

  constructor(private readonly offreService: OffreService) {}

  @Post('upload')
  @ApiOperation({ summary: "Upload image d'une offre" })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'offre-' + unique + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        return cb(new Error('Seules les images jpg/png/webp sont acceptées'), false);
      }
      cb(null, true);
    },
  }))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/${file.filename}` };
  }

  @Post()
  @ApiOperation({ summary: 'Créer une offre' })
  create(@Body() body: CreateOffreDto) {
    return this.offreService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les offres' })
  findAll() {
    return this.offreService.findAll();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une offre' })
  update(@Param('id') id: string, @Body() body: UpdateOffreDto) {
    return this.offreService.update(+id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une offre' })
  delete(@Param('id') id: string) {
    return this.offreService.delete(+id);
  }
}