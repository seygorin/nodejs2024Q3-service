export class Track {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;

  constructor(partial: Partial<Track>) {
    Object.assign(this, partial);
  }

  removeArtist(): void {
    this.artistId = null;
  }

  removeAlbum(): void {
    this.albumId = null;
  }

  validate(): boolean {
    return Boolean(
      this.name && typeof this.duration === 'number' && this.duration > 0,
    );
  }

  update(updateData: Partial<Track>): void {
    Object.assign(this, updateData);
  }
}
