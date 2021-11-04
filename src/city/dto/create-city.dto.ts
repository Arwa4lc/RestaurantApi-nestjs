import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCityDto {
  @ApiProperty({ description: 'cityName', example: 'Cairo' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
