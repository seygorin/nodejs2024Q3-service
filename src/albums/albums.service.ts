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
    const album = new Album({
      id: uuidv4(),
      ...createAlbumDto,
      artistId: createAlbumDto.artistId || null,
    });

    if (!album.validate()) {
      throw new BadRequestException('Invalid album data');
    }

    this.albums.push(album);
    return album;
  }

  update(id: string, updateAlbumDto: CreateAlbumDto): Album {
    const album = this.findOne(id);

    try {
      album.update(updateAlbumDto);
      return album;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid album data');
    }
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
    this.albums
      .filter((album) => album.artistId === artistId)
      .forEach((album) => album.removeArtist());
  }
}
