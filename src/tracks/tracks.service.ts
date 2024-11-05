import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Track } from './entities/track.entity';
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

    if (!track.validate()) {
      throw new BadRequestException('Invalid track data');
    }

    this.tracks.push(track);
    return track;
  }

  update(id: string, updateTrackDto: CreateTrackDto): Track {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    const updatedTrack = new Track({
      ...this.tracks[index],
      ...updateTrackDto,
    });

    if (!updatedTrack.validate()) {
      throw new BadRequestException('Invalid track data');
    }

    this.tracks[index] = updatedTrack;
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
    this.tracks
      .filter((track) => track.artistId === artistId)
      .forEach((track) => track.removeArtist());
  }

  removeAlbumFromTracks(albumId: string): void {
    this.tracks
      .filter((track) => track.albumId === albumId)
      .forEach((track) => track.removeAlbum());
  }
}
