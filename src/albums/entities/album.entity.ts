import { BadRequestException } from '@nestjs/common';

const CURRENT_YEAR = new Date().getFullYear();
export class Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;

  constructor(partial: Partial<Album>) {
    Object.assign(this, partial);
  }

  validate(): boolean {
    return Boolean(
      this.name?.trim() &&
        typeof this.year === 'number' &&
        this.year >= 1900 &&
        this.year <= CURRENT_YEAR &&
        (this.artistId === null || typeof this.artistId === 'string'),
    );
  }

  update(updateData: Partial<Album>): void {
    if (!this.validateUpdateData(updateData)) {
      throw new BadRequestException('Invalid album data');
    }

    if (updateData.name !== undefined) {
      this.name = updateData.name;
    }
    if (updateData.year !== undefined) {
      this.year = updateData.year;
    }
    if (updateData.artistId !== undefined) {
      this.artistId = updateData.artistId;
    }
  }

  private validateUpdateData(updateData: Partial<Album>): boolean {
    if (updateData.name !== undefined && !updateData.name?.trim()) {
      return false;
    }

    if (updateData.year !== undefined) {
      if (
        typeof updateData.year !== 'number' ||
        updateData.year < 1900 ||
        updateData.year > CURRENT_YEAR
      ) {
        return false;
      }
    }

    if (
      updateData.artistId !== undefined &&
      updateData.artistId !== null &&
      typeof updateData.artistId !== 'string'
    ) {
      return false;
    }

    return true;
  }

  removeArtist(): void {
    this.artistId = null;
  }
}
