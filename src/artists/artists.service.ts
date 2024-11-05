import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from './interfaces/artist.interface';
import { CreateArtistDto } from './dto/create-artist.dto';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';

@Injectable()
export class ArtistsService {
  private artists: Artist[] = [];

  constructor(
    private readonly tracksService: TracksService,
    private readonly albumsService: AlbumsService,
  ) {}

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return artist;
  }

  create(createArtistDto: CreateArtistDto): Artist {
    if (!createArtistDto.name || typeof createArtistDto.grammy !== 'boolean') {
      throw new BadRequestException('Name and grammy status are required');
    }

    const artist = new Artist({
      id: uuidv4(),
      ...createArtistDto,
    });
    this.artists.push(artist);
    return artist;
  }

  update(id: string, updateArtistDto: CreateArtistDto): Artist {
    if (!updateArtistDto.name || typeof updateArtistDto.grammy !== 'boolean') {
      throw new BadRequestException('Name and grammy status are required');
    }

    const index = this.artists.findIndex((artist) => artist.id === id);
    if (index === -1) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    this.artists[index] = {
      ...this.artists[index],
      ...updateArtistDto,
    };

    return this.artists[index];
  }

  remove(id: string): void {
    const index = this.artists.findIndex((artist) => artist.id === id);
    if (index === -1) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    this.tracksService.removeArtistFromTracks(id);

    this.albumsService.removeArtistFromAlbums(id);

    this.artists.splice(index, 1);
  }
}
