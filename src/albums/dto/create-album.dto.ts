import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

const CURRENT_YEAR = new Date().getFullYear();
const MAX_FUTURE_YEARS = 1;

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1900)
  @Max(CURRENT_YEAR + MAX_FUTURE_YEARS)
  year: number;

  @IsOptional()
  @IsUUID('4')
  artistId?: string | null;
}
