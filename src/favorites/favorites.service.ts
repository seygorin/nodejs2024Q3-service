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

    const favoritesWithRelations = await this.prisma.favorites.findUnique({
      where: { id: favorites.id },
      select: {
        artists: {
          select: {
            id: true,
            name: true,
            grammy: true,
          },
        },
        albums: {
          select: {
            id: true,
            name: true,
            year: true,
            artistId: true,
          },
        },
        tracks: {
          select: {
            id: true,
            name: true,
            duration: true,
            artistId: true,
            albumId: true,
          },
        },
      },
    });

    return {
      artists: favoritesWithRelations.artists,
      albums: favoritesWithRelations.albums,
      tracks: favoritesWithRelations.tracks,
    };
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

  async addTrack(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new UnprocessableEntityException('Track not found');
    }

    const favorites = await this.getOrCreateFavorites();

    await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        tracks: {
          connect: { id },
        },
      },
    });
  }

  async addAlbum(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new UnprocessableEntityException('Album not found');
    }

    const favorites = await this.getOrCreateFavorites();

    await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        albums: {
          connect: { id },
        },
      },
    });
  }

  async addArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new UnprocessableEntityException('Artist not found');
    }

    const favorites = await this.getOrCreateFavorites();

    await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        artists: {
          connect: { id },
        },
      },
    });
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
}
