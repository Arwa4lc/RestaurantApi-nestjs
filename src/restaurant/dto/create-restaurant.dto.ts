import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    type: 'file',
  })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type: string;

  @ApiProperty()
  @IsDefined()
  longitude: number;

  @ApiProperty()
  @IsDefined()
  latitude: number;
}
