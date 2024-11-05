import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsUUID('4')
  artistId?: string | null;

  @IsOptional()
  @IsUUID('4')
  albumId?: string | null;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  duration: number;
}
