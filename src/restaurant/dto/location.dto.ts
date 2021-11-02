import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class LocationDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsArray()
  @IsNotEmpty()
  coordinates: number[];
}
