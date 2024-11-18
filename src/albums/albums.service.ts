import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class AlbumsService {
  constructor(
    private prisma: PrismaService,
    private readonly tracksService: TracksService,
  ) {}

  async findAll() {
    return this.prisma.album.findMany({
      include: {
        artist: true,
      },
    });
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
      include: {
        artist: true,
      },
    });

    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    return album;
  }

  async create(createAlbumDto: CreateAlbumDto) {
    try {
      return await this.prisma.album.create({
        data: {
          name: createAlbumDto.name,
          year: createAlbumDto.year,
          artistId: createAlbumDto.artistId || null,
        },
        include: {
          artist: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException(
          `Artist with ID ${createAlbumDto.artistId} not found`,
        );
      }
      throw new BadRequestException('Invalid album data');
    }
  }

  async update(id: string, updateAlbumDto: CreateAlbumDto) {
    try {
      return await this.prisma.album.update({
        where: { id },
        data: {
          name: updateAlbumDto.name,
          year: updateAlbumDto.year,
          artistId: updateAlbumDto.artistId || null,
        },
        include: {
          artist: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Album with ID ${id} not found`);
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          `Artist with ID ${updateAlbumDto.artistId} not found`,
        );
      }
      throw new BadRequestException('Invalid album data');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.album.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Album with ID ${id} not found`);
      }
      throw error;
    }
  }

  async removeArtistFromAlbums(artistId: string) {
    await this.prisma.album.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }
}
