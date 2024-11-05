import { Artist } from '../../artists/entities/artist.entity';
import { Album } from '../../albums/entities/album.entity';
import { Track } from '../../tracks/entities/track.entity';

export class Favorites {
  artists: string[] = [];
  albums: string[] = [];
  tracks: string[] = [];

  constructor(partial?: Partial<Favorites>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  toResponse(): FavoritesResponse {
    return {
      artists: [] as Artist[],
      albums: [] as Album[],
      tracks: [] as Track[],
    };
  }
}

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
