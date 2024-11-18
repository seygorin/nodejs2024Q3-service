export interface FavoritesResponse {
  artists: {
    id: string;
    name: string;
    grammy: boolean;
  }[];
  albums: {
    id: string;
    name: string;
    year: number;
    artistId: string | null;
  }[];
  tracks: {
    id: string;
    name: string;
    artistId: string | null;
    albumId: string | null;
    duration: number;
  }[];
}
