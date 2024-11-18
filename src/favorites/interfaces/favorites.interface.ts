export interface FavoritesResponse {
  artists: {
    id: string;
    name: string;
    grammy: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[];
  albums: {
    id: string;
    name: string;
    year: number;
    artistId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
  tracks: {
    id: string;
    name: string;
    artistId: string | null;
    albumId: string | null;
    duration: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
}
