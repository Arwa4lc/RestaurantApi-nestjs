import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthModule } from 'src/auth/auth.module';
import authConfig from 'src/auth/config/auth.config';
import { citySchema } from 'src/city/city.model';
import { CityModule } from 'src/city/city.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CommonModule } from 'src/common/common.module';
import { FileConsumer } from './file-consumer';
import { FileProducerService } from './file-producer.service';
import { RestaurantController } from './restaurant.controller';
import { restaurantSchema } from './restaurant.model';
import { RestaurantService } from './restaurant.service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'fileOperation',
    }),
    MongooseModule.forFeature([
      { name: 'Restaurant', schema: restaurantSchema },
    ]),
    MongooseModule.forFeature([{ name: 'City', schema: citySchema }]),
    ConfigModule.forFeature(authConfig),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        storage: diskStorage({
          destination: function (req, file, cb) {
            cb(null, './uploads/');
          },
          filename: function (req, file, cb) {
            cb(null, file.originalname);
          },
        }),
      }),
    }),
    CityModule,
    CloudinaryModule,
    AuthModule,
    CommonModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService, FileProducerService, FileConsumer],
})
export class RestaurantModule {}
