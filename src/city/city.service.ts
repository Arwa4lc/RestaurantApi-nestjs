import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City } from './city.model';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CityService {
  constructor(@InjectModel('City') private City: Model<City>) {}

  async getAll() {
    const cities = this.City.find({});
    return cities;
  }

  async getById(cityId: string) {
    const city = await this.City.findById(cityId);
    if (!city) {
      throw new NotFoundException('City with the given ID not found');
    }

    return city;
  }

  async createCity(createCityDto: CreateCityDto) {
    try {
      const city = await this.City.create(createCityDto);
      return city;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateCity(cityId: string, updateCityDto: UpdateCityDto) {
    let city = await this.City.findByIdAndUpdate(cityId, updateCityDto, {
      new: true,
    });
    if (!city) {
      throw new NotFoundException('City with the given ID not found');
    }

    return city;
  }

  async deleteCity(cityId: string) {
    let city = await this.City.findByIdAndDelete(cityId);
    if (!city) {
      throw new NotFoundException('City with the given ID not found');
    }

    return;
  }
}
