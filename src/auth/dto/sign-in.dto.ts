import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'arwa@example.com' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'index@14' })
  @IsString()
  password: string;
}
