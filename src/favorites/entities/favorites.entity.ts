import { Artist } from '../../artists/entities/artist.entity';
import { Album } from '../../albums/entities/album.entity';
import { Track } from '../../tracks/entities/track.entity';
import { NotFoundException } from '@nestjs/common';

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

export class Favorites {
  artists: string[] = [];
  albums: string[] = [];
  tracks: string[] = [];

  constructor(partial?: Partial<Favorites>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  addTrack(id: string): void {
    if (!this.tracks.includes(id)) {
      this.tracks.push(id);
    }
  }

  removeTrack(id: string): void {
    const index = this.tracks.indexOf(id);
    if (index === -1) {
      throw new NotFoundException(`Track with id ${id} is not in favorites`);
    }
    this.tracks.splice(index, 1);
  }

  addAlbum(id: string): void {
    if (!this.albums.includes(id)) {
      this.albums.push(id);
    }
  }

  removeAlbum(id: string): void {
    const index = this.albums.indexOf(id);
    if (index === -1) {
      throw new NotFoundException(`Album with id ${id} is not in favorites`);
    }
    this.albums.splice(index, 1);
  }

  addArtist(id: string): void {
    if (!this.artists.includes(id)) {
      this.artists.push(id);
    }
  }

  removeArtist(id: string): void {
    const index = this.artists.indexOf(id);
    if (index === -1) {
      throw new NotFoundException(`Artist with id ${id} is not in favorites`);
    }
    this.artists.splice(index, 1);
  }
}
