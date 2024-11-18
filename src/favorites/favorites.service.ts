import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TracksService } from '../tracks/tracks.service';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { FavoritesResponse } from './interfaces/favorites.interface';

@Injectable()
export class FavoritesService {
  constructor(
    private prisma: PrismaService,
    private readonly tracksService: TracksService,
    private readonly artistsService: ArtistsService,
    private readonly albumsService: AlbumsService,
  ) {}

  async findAll(): Promise<FavoritesResponse> {
    const favorites = await this.getOrCreateFavorites();

    return {
      artists: await this.prisma.artist.findMany({
        where: {
          favorites: {
            some: {
              id: favorites.id,
            },
          },
        },
      }),
      albums: await this.prisma.album.findMany({
        where: {
          favorites: {
            some: {
              id: favorites.id,
            },
          },
        },
      }),
      tracks: await this.prisma.track.findMany({
        where: {
          favorites: {
            some: {
              id: favorites.id,
            },
          },
        },
      }),
    };
  }

  async addTrack(id: string) {
    try {
      await this.tracksService.findOne(id);

      const favorites = await this.getOrCreateFavorites();

      await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: {
          tracks: {
            connect: { id },
          },
        },
      });
    } catch (error) {
      throw new UnprocessableEntityException(
        `Track with id ${id} does not exist`,
      );
    }
  }

  async addAlbum(id: string) {
    try {
      await this.albumsService.findOne(id);

      const favorites = await this.getOrCreateFavorites();

      await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: {
          albums: {
            connect: { id },
          },
        },
      });
    } catch (error) {
      throw new UnprocessableEntityException(
        `Album with id ${id} does not exist`,
      );
    }
  }

  async addArtist(id: string) {
    try {
      await this.artistsService.findOne(id);

      const favorites = await this.getOrCreateFavorites();

      await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: {
          artists: {
            connect: { id },
          },
        },
      });
    } catch (error) {
      throw new UnprocessableEntityException(
        `Artist with id ${id} does not exist`,
      );
    }
  }

  async removeTrack(id: string) {
    const favorites = await this.getOrCreateFavorites();

    await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        tracks: {
          disconnect: { id },
        },
      },
    });
  }

  async removeAlbum(id: string) {
    const favorites = await this.getOrCreateFavorites();

    await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        albums: {
          disconnect: { id },
        },
      },
    });
  }

  async removeArtist(id: string) {
    const favorites = await this.getOrCreateFavorites();

    await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        artists: {
          disconnect: { id },
        },
      },
    });
  }

  private async getOrCreateFavorites() {
    let favorites = await this.prisma.favorites.findFirst();

    if (!favorites) {
      favorites = await this.prisma.favorites.create({
        data: {},
      });
    }

    return favorites;
  }
}
