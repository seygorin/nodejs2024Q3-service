import { BadRequestException } from '@nestjs/common';

export class Artist {
  id: string;
  name: string;
  grammy: boolean;

  constructor(partial: Partial<Artist>) {
    Object.assign(this, partial);
  }

  validate(): boolean {
    return Boolean(this.name?.trim() && typeof this.grammy === 'boolean');
  }

  validateUpdateData(updateData: Partial<Artist>): boolean {
    return Boolean(
      updateData.name?.trim() && typeof updateData.grammy === 'boolean',
    );
  }

  update(updateData: Partial<Artist>): void {
    if (!this.validateUpdateData(updateData)) {
      throw new BadRequestException('Invalid artist data');
    }

    this.name = updateData.name;
    this.grammy = updateData.grammy;
  }
}
