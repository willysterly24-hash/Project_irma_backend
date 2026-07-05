import {
  Controller, Get, Post, Put, Delete,
  Param, Body, ParseIntPipe, UseGuards,
  UploadedFiles, UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HotelService } from './hotel.service';
import { CreateHotelDto, UpdateHotelDto } from './hotel.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/user.entity';

@ApiTags('Hotels')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('hotel')
export class HotelController {

  constructor(private readonly hotelService: HotelService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les hôtels' })
  findAll() {
    return this.hotelService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un hôtel par ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hotelService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Créer un hôtel (admin)' })
  create(@Body() dto: CreateHotelDto) {
    return this.hotelService.create(dto);
  }

  // POST /hotel/:id/photos — upload multiple (max 4)
  @Post(':id/photos')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Upload photos d'un hôtel (jusqu'à 4, admin)" })
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
        cb(null, 'hotel-' + unique + extname(file.originalname));
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
    const hotel = await this.hotelService.addPhotos(id, urls);
    return { photos: hotel.photos };
  }

  // DELETE /hotel/:id/photos — supprime une photo précise
  @Delete(':id/photos')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Supprimer une photo d'un hôtel (admin)" })
  async removePhoto(
    @Param('id', ParseIntPipe) id: number,
    @Body('url') url: string,
  ) {
    const hotel = await this.hotelService.removePhoto(id, url);
    return { photos: hotel.photos };
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Modifier un hôtel (admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHotelDto,
  ) {
    return this.hotelService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Supprimer un hôtel (admin)' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.hotelService.delete(id);
  }
}