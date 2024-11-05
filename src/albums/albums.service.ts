import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class AlbumsService {
  private albums: Album[] = [];

  constructor(private readonly tracksService: TracksService) {}

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    const album = this.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return album;
  }

  create(createAlbumDto: CreateAlbumDto): Album {
    this.validateAlbumDto(createAlbumDto);

    const album = new Album({
      id: uuidv4(),
      ...createAlbumDto,
      artistId: createAlbumDto.artistId || null,
    });
    this.albums.push(album);
    return album;
  }

  update(id: string, updateAlbumDto: CreateAlbumDto): Album {
    this.validateAlbumDto(updateAlbumDto);

    const index = this.albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    this.albums[index] = {
      ...this.albums[index],
      ...updateAlbumDto,
      artistId: updateAlbumDto.artistId || null,
    };

    return this.albums[index];
  }

  remove(id: string): void {
    const index = this.albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    this.tracksService.removeAlbumFromTracks(id);

    this.albums.splice(index, 1);
  }

  removeArtistFromAlbums(artistId: string): void {
    this.albums = this.albums.map((album) => {
      if (album.artistId === artistId) {
        return { ...album, artistId: null };
      }
      return album;
    });
  }

  private validateAlbumDto(dto: CreateAlbumDto): void {
    if (!dto) {
      throw new BadRequestException('Album data is required');
    }

    if (!dto.name || typeof dto.name !== 'string' || !dto.name.trim()) {
      throw new BadRequestException(
        'Album name is required and must be a non-empty string',
      );
    }

    if (
      !dto.year ||
      typeof dto.year !== 'number' ||
      dto.year < 1900 ||
      dto.year > 2024
    ) {
      throw new BadRequestException(
        'Album year is required and must be a valid year between 1900 and 2024',
      );
    }

    if (
      dto.artistId !== undefined &&
      dto.artistId !== null &&
      typeof dto.artistId !== 'string'
    ) {
      throw new BadRequestException(
        'Artist ID must be a valid UUID string or null',
      );
    }
  }
}
