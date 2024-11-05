import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArtistDto {
  @ApiProperty({
    example: 'Michael Jackson',
    description: 'The name of the artist',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: true,
    description: 'Whether the artist has a Grammy award',
  })
  @IsBoolean()
  @IsNotEmpty()
  grammy: boolean;
}
