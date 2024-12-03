import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesResponse } from './interfaces/favorites.interface';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Favorites')
@ApiBearerAuth('JWT-auth')
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async findAll(): Promise<FavoritesResponse> {
    return this.favoritesService.findAll();
  }

  @Post('/track/:id')
  @HttpCode(201)
  async addTrack(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.favoritesService.addTrack(id);
  }

  @Post('/album/:id')
  @HttpCode(201)
  async addAlbum(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.favoritesService.addAlbum(id);
  }

  @Post('/artist/:id')
  @HttpCode(201)
  async addArtist(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.favoritesService.addArtist(id);
  }

  @Delete('/track/:id')
  @HttpCode(204)
  async removeTrack(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.favoritesService.removeTrack(id);
  }

  @Delete('/album/:id')
  @HttpCode(204)
  async removeAlbum(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.favoritesService.removeAlbum(id);
  }

  @Delete('/artist/:id')
  @HttpCode(204)
  async removeArtist(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.favoritesService.removeArtist(id);
  }
}
