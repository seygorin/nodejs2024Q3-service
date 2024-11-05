import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favorites, FavoritesResponse } from './entities/favorites.entity';
import { TracksService } from '../tracks/tracks.service';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';

@Injectable()
export class FavoritesService {
  private favorites: Favorites;

  constructor(
    private readonly tracksService: TracksService,
    private readonly artistsService: ArtistsService,
    private readonly albumsService: AlbumsService,
  ) {
    this.favorites = new Favorites();
  }

  async findAll(): Promise<FavoritesResponse> {
    const artists = this.favorites.artists
      .map((id) => {
        try {
          return this.artistsService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter((artist) => artist !== null);

    const albums = this.favorites.albums
      .map((id) => {
        try {
          return this.albumsService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter((album) => album !== null);

    const tracks = this.favorites.tracks
      .map((id) => {
        try {
          return this.tracksService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter((track) => track !== null);

    return {
      artists,
      albums,
      tracks,
    };
  }

  async addTrack(id: string): Promise<void> {
    try {
      const track = await this.tracksService.findOne(id);
      if (!this.favorites.tracks.includes(id)) {
        this.favorites.tracks.push(id);
      }
    } catch {
      throw new UnprocessableEntityException(
        `Track with id ${id} does not exist`,
      );
    }
  }

  async removeTrack(id: string): Promise<void> {
    const index = this.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new NotFoundException(`Track with id ${id} is not in favorites`);
    }
    this.favorites.tracks.splice(index, 1);
  }

  async addAlbum(id: string): Promise<void> {
    try {
      const album = await this.albumsService.findOne(id);
      if (!this.favorites.albums.includes(id)) {
        this.favorites.albums.push(id);
      }
    } catch {
      throw new UnprocessableEntityException(
        `Album with id ${id} does not exist`,
      );
    }
  }

  async removeAlbum(id: string): Promise<void> {
    const index = this.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new NotFoundException(`Album with id ${id} is not in favorites`);
    }
    this.favorites.albums.splice(index, 1);
  }

  async addArtist(id: string): Promise<void> {
    try {
      const artist = await this.artistsService.findOne(id);
      if (!this.favorites.artists.includes(id)) {
        this.favorites.artists.push(id);
      }
    } catch {
      throw new UnprocessableEntityException(
        `Artist with id ${id} does not exist`,
      );
    }
  }

  async removeArtist(id: string): Promise<void> {
    const index = this.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new NotFoundException(`Artist with id ${id} is not in favorites`);
    }
    this.favorites.artists.splice(index, 1);
  }
}
