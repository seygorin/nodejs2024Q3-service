import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ example: 'testuser', description: 'User login' })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ example: 'Test123!', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
