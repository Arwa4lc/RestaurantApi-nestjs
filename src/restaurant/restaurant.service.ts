import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City } from 'src/city/city.model';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { FileProducerService } from './file-producer.service';
import { Restaurant } from './restaurant.model';
import * as mongoose from 'mongoose';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel('Restaurant') private Restaurant: Model<Restaurant>,
    @InjectModel('City') private City: Model<City>,
    private cloudinary: CloudinaryService,
    private fileProducerService: FileProducerService,
  ) {}

  async getAll(query) {
    let restaurants;
    try {
      if (query.name) {
        const text = `^${query.name}`;
        const Regex = new RegExp(text);
        restaurants = await this.Restaurant.find({
          name: query.name == '' ? /^$|/ : Regex,
        });
        if (!restaurants || restaurants.length === 0) {
          throw new NotFoundException('No results found');
        }

        return restaurants;
      }

      if (query.longitude && query.latitude) {
        restaurants = await this.Restaurant.find({
          location: {
            $near: {
              $maxDistance: 1000,
              $geometry: {
                type: 'Point',
                coordinates: [query.longitude, query.latitude],
              },
            },
          },
        });
        if (!restaurants || restaurants.length === 0) {
          throw new NotFoundException('No results found');
        }

        return restaurants;
      }

      restaurants = await this.Restaurant.find({});
      return restaurants;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(restaurantID: string) {
    const restaurant = await this.Restaurant.findById(restaurantID);
    if (!restaurant) {
      throw new NotFoundException('Restaurant with the given ID not found');
    }

    return restaurant;
  }

  async getStatistics() {
    try {
      const restaurant = await this.Restaurant.aggregate([
        {
          $lookup: {
            from: 'cities',
            localField: 'city',
            foreignField: '_id',
            as: 'city',
          },
        },
        { $unwind: '$city' },
        {
          $group: {
            _id: '$city.name',
            Restaurants: { $sum: 1 },
          },
        },
      ]);
      if (!restaurant || restaurant.length === 0) {
        throw new NotFoundException('No results found');
      }

      return restaurant;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
    image: Express.Multer.File,
  ) {
    const isValidId = mongoose.Types.ObjectId.isValid(createRestaurantDto.city);
    if (!isValidId) {
      throw new BadRequestException('cityId must be valid Id');
    }

    const city = await this.City.findById(createRestaurantDto.city);
    if (!city) {
      throw new NotFoundException('City with the given ID not found');
    }

    const restaurantWithEmail = await this.Restaurant.findOne({
      email: createRestaurantDto.email,
    });
    if (restaurantWithEmail) {
      throw new ConflictException('Document with the same email exists');
    }

    let img;
    if (image) {
      img = await this.cloudinary.uploadImage(image.path);
      createRestaurantDto.image = img.image;
    }

    try {
      const restaurant = await this.Restaurant.create({
        ...createRestaurantDto,
        location: {
          coordinates: [
            createRestaurantDto.longitude,
            createRestaurantDto.latitude,
          ],
        },
      });

      if (image) await this.fileProducerService.deleteFile(image);
      return restaurant;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateRestaurant(
    restaurantID: string,
    updateRestaurantDto: UpdateRestaurantDto,
    image: Express.Multer.File,
  ) {
    let restaurant = await this.Restaurant.findById(restaurantID);
    // console.log(restaurant);

    if (!restaurant) {
      throw new NotFoundException('Restaurant with the given ID not found');
    }

    delete updateRestaurantDto.city;
    const restaurantWIthEmail = await this.Restaurant.findOne({
      email: updateRestaurantDto?.email,
    });
    if (restaurantWIthEmail) {
      throw new ConflictException('email in use');
    }

    let img;
    if (image) {
      img = await this.cloudinary.uploadImage(image.path);
      updateRestaurantDto.image = img.image;
    }

    console.log(updateRestaurantDto?.longitude);
    console.log(updateRestaurantDto?.latitude);

    try {
      await restaurant
        .set({
          ...updateRestaurantDto,
          location: {
            // type: updateRestaurantDto?.type,
            coordinates: [
              updateRestaurantDto?.longitude
                ? updateRestaurantDto.longitude
                : restaurant.location.coordinates[0],
              updateRestaurantDto?.latitude
                ? updateRestaurantDto.latitude
                : restaurant.location.coordinates[1],
            ],
          },
        })
        .save();

      if (image) await this.fileProducerService.deleteFile(image);
      return restaurant;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteRestaurant(restaurantID: string) {
    const restaurant = await this.Restaurant.findByIdAndDelete(restaurantID);
    if (!restaurant) {
      throw new NotFoundException('Restaurant with the given ID not found');
    }

    return;
  }
}
