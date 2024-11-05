import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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

    return { artists, albums, tracks };
  }

  async addTrack(id: string): Promise<void> {
    try {
      await this.tracksService.findOne(id);
      this.favorites.addTrack(id);
    } catch {
      throw new UnprocessableEntityException(
        `Track with id ${id} does not exist`,
      );
    }
  }

  async addAlbum(id: string): Promise<void> {
    try {
      await this.albumsService.findOne(id);
      this.favorites.addAlbum(id);
    } catch {
      throw new UnprocessableEntityException(
        `Album with id ${id} does not exist`,
      );
    }
  }

  async addArtist(id: string): Promise<void> {
    try {
      await this.artistsService.findOne(id);
      this.favorites.addArtist(id);
    } catch {
      throw new UnprocessableEntityException(
        `Artist with id ${id} does not exist`,
      );
    }
  }

  async removeTrack(id: string): Promise<void> {
    this.favorites.removeTrack(id);
  }

  async removeAlbum(id: string): Promise<void> {
    this.favorites.removeAlbum(id);
  }

  async removeArtist(id: string): Promise<void> {
    this.favorites.removeArtist(id);
  }
}
