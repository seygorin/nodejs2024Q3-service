import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.track.findMany({
      include: {
        artist: true,
        album: true,
      },
    });
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
      include: {
        artist: true,
        album: true,
      },
    });

    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    return track;
  }

  async create(createTrackDto: CreateTrackDto) {
    try {
      return await this.prisma.track.create({
        data: {
          name: createTrackDto.name,
          duration: createTrackDto.duration,
          artistId: createTrackDto.artistId || null,
          albumId: createTrackDto.albumId || null,
        },
        include: {
          artist: true,
          album: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        if (error.meta?.field_name?.includes('artistId')) {
          throw new BadRequestException(
            `Artist with ID ${createTrackDto.artistId} not found`,
          );
        }
        if (error.meta?.field_name?.includes('albumId')) {
          throw new BadRequestException(
            `Album with ID ${createTrackDto.albumId} not found`,
          );
        }
      }
      throw new BadRequestException('Invalid track data');
    }
  }

  async update(id: string, updateTrackDto: CreateTrackDto) {
    try {
      return await this.prisma.track.update({
        where: { id },
        data: {
          name: updateTrackDto.name,
          duration: updateTrackDto.duration,
          artistId: updateTrackDto.artistId || null,
          albumId: updateTrackDto.albumId || null,
        },
        include: {
          artist: true,
          album: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Track with ID ${id} not found`);
      }
      if (error.code === 'P2003') {
        if (error.meta?.field_name?.includes('artistId')) {
          throw new BadRequestException(
            `Artist with ID ${updateTrackDto.artistId} not found`,
          );
        }
        if (error.meta?.field_name?.includes('albumId')) {
          throw new BadRequestException(
            `Album with ID ${updateTrackDto.albumId} not found`,
          );
        }
      }
      throw new BadRequestException('Invalid track data');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.track.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Track with ID ${id} not found`);
      }
      throw error;
    }
  }

  async removeArtistFromTracks(artistId: string) {
    await this.prisma.track.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }

  async removeAlbumFromTracks(albumId: string) {
    await this.prisma.track.updateMany({
      where: { albumId },
      data: { albumId: null },
    });
  }
}
