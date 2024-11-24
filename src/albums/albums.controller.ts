import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  findAll() {
    return this.albumsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.albumsService.findOne(id);
  }

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {
    if (!createAlbumDto || Object.keys(createAlbumDto).length === 0) {
      throw new BadRequestException('Request body is required');
    }

    if (!createAlbumDto.name || typeof createAlbumDto.year !== 'number') {
      throw new BadRequestException('Album name and year are required');
    }

    return this.albumsService.create(createAlbumDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlbumDto: CreateAlbumDto,
  ) {
    if (!updateAlbumDto || Object.keys(updateAlbumDto).length === 0) {
      throw new BadRequestException('Request body is required');
    }

    if (!updateAlbumDto.name || typeof updateAlbumDto.year !== 'number') {
      throw new BadRequestException('Album name and year are required');
    }

    return this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.albumsService.remove(id);
  }
}
