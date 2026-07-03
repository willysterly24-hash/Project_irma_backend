import {
  Controller, Get, Post, Put, Delete,
  Param, Body, ParseIntPipe, Query, UseGuards,
  UploadedFiles, UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ChambreService } from './chambre.service';
import { CreateChambreDto, UpdateChambreDto } from './chambre.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth, ApiConsumes, ApiBody  } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Chambres')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chambre')
export class ChambreController {

  constructor(private readonly chambreService: ChambreService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les chambres' })
  @ApiQuery({ name: 'dispo', required: false, type: Boolean })
  findAll(@Query('dispo') dispo?: string) {
    const dispoFilter = dispo !== undefined ? dispo === 'true' : undefined;
    return this.chambreService.findAll(dispoFilter);
  }

  @Get('hotel/:hotelId')
  @ApiOperation({ summary: "Récupérer les chambres d'un hôtel" })
  findByHotel(@Param('hotelId', ParseIntPipe) hotelId: number) {
    return this.chambreService.findByHotel(hotelId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une chambre par ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chambreService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une chambre' })
  create(@Body() dto: CreateChambreDto) {
    return this.chambreService.create(dto);
  }

  // POST /chambre/:id/photos — upload multiple (max 4)
  @Post(':id/photos')
  @ApiOperation({ summary: "Upload photos d'une chambre (jusqu'à 4)" })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 4, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'chambre-' + unique + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        return cb(new Error('Seules les images jpg/png/webp sont acceptées'), false);
      }
      cb(null, true);
    },
  }))
  async uploadPhotos(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const urls = files.map(f => `/uploads/${f.filename}`);
    const chambre = await this.chambreService.addPhotos(id, urls);
    return { photos: chambre.photos };
  }

  // DELETE /chambre/:id/photos — supprime une photo précise
  @Delete(':id/photos')
  @ApiOperation({ summary: "Supprimer une photo d'une chambre" })
  async removePhoto(
    @Param('id', ParseIntPipe) id: number,
    @Body('url') url: string,
  ) {
    const chambre = await this.chambreService.removePhoto(id, url);
    return { photos: chambre.photos };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une chambre' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateChambreDto) {
    return this.chambreService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une chambre' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.chambreService.delete(id);
  }
}