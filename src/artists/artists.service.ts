import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';

@Injectable()
export class ArtistsService {
  constructor(
    private prisma: PrismaService,
    private readonly tracksService: TracksService,
    private readonly albumsService: AlbumsService,
  ) {}

  async findAll() {
    return this.prisma.artist.findMany({
      include: {
        albums: true,
        tracks: true,
      },
    });
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      include: {
        albums: true,
        tracks: true,
      },
    });

    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    return artist;
  }

  async create(createArtistDto: CreateArtistDto) {
    try {
      return await this.prisma.artist.create({
        data: {
          name: createArtistDto.name,
          grammy: createArtistDto.grammy,
        },
        include: {
          albums: true,
          tracks: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Invalid artist data');
    }
  }

  async update(id: string, updateArtistDto: CreateArtistDto) {
    try {
      return await this.prisma.artist.update({
        where: { id },
        data: {
          name: updateArtistDto.name,
          grammy: updateArtistDto.grammy,
        },
        include: {
          albums: true,
          tracks: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Artist with ID ${id} not found`);
      }
      throw new BadRequestException('Invalid artist data');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.$transaction(async (prisma) => {
        await Promise.all([
          this.tracksService.removeArtistFromTracks(id),
          this.albumsService.removeArtistFromAlbums(id),
        ]);

        await prisma.artist.delete({
          where: { id },
        });
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Artist with ID ${id} not found`);
      }
      throw error;
    }
  }
}
