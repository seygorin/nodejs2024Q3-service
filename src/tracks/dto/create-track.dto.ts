import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackDto {
  @ApiProperty({ example: 'Billie Jean', description: 'The name of the track' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 180,
    description: 'The duration of the track in seconds',
  })
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    example: 'e37b6c61-2ef0-41e0-a421-f8f3311f6977',
    description: 'The ID of the artist',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  artistId?: string | null;

  @ApiProperty({
    example: 'e37b6c11-9ef0-41e0-a421-f8f3311f6977',
    description: 'The ID of the album',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  albumId?: string | null;
}
