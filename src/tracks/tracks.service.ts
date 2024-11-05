import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Track } from './interfaces/track.interface';
import { CreateTrackDto } from './dto/create-track.dto';

@Injectable()
export class TracksService {
  private tracks: Track[] = [];

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track {
    const track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    return track;
  }

  create(createTrackDto: CreateTrackDto): Track {
    const track = new Track({
      id: uuidv4(),
      ...createTrackDto,
    });
    this.tracks.push(track);
    return track;
  }

  update(id: string, updateTrackDto: CreateTrackDto): Track {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    this.tracks[index] = {
      ...this.tracks[index],
      ...updateTrackDto,
    };

    return this.tracks[index];
  }

  remove(id: string): void {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    this.tracks.splice(index, 1);
  }

  removeArtistFromTracks(artistId: string): void {
    this.tracks = this.tracks.map((track) => {
      if (track.artistId === artistId) {
        return { ...track, artistId: null };
      }
      return track;
    });
  }

  removeAlbumFromTracks(albumId: string): void {
    this.tracks = this.tracks.map((track) => {
      if (track.albumId === albumId) {
        return { ...track, albumId: null };
      }
      return track;
    });
  }
}
