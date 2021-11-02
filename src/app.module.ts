import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CityModule } from './city/city.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB: Joi.required(),
        JWT_KEY: Joi.required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config) => ({
        uri: config.get('DB'),
        useNewUrlParser: true,
      }),
    }),
    AuthModule,
    CityModule,
    RestaurantModule,
    CloudinaryModule,
    CommonModule,
  ],
})
export class AppModule {}
