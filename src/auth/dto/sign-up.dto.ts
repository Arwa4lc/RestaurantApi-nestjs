import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../auth.model';

export class SignUpDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsNotEmpty()
  role: Role;
}
