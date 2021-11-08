import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { IsDuplicated } from '../../common/decorators/IsDuplicated';

export class SignUpDto {
  @IsString()
  @ApiProperty({ example: 'arwa' })
  name: string;

  @ApiProperty({ example: 'arwa@example.com' })
  @IsString()
  @IsEmail()
  @IsDuplicated({
    message: 'User with the same email already exists',
  })
  email: string;

  @ApiProperty({ example: 'index@14' })
  @IsString()
  password: string;
}
