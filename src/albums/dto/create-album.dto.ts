import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

const CURRENT_YEAR = new Date().getFullYear();

export class CreateAlbumDto {
  @ApiProperty({ example: 'Thriller', description: 'The name of the album' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 2023, description: 'The release year of the album' })
  @IsNumber()
  @Type(() => Number)
  @Min(1900)
  @Max(CURRENT_YEAR + 1)
  year: number;

  @ApiProperty({
    example: 'e37b6c11-9ef0-41e0-a221-f8f3311f6977',
    description: 'The ID of the artist',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  artistId?: string | null;
}
