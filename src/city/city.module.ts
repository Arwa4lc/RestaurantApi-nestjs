import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import authConfig from 'src/auth/config/auth.config';
import { CommonModule } from 'src/common/common.module';
import { CityController } from './city.controller';
import { citySchema } from './city.model';
import { CityService } from './city.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'City', schema: citySchema }]),
    ConfigModule.forFeature(authConfig),
    AuthModule,
    CommonModule,
  ],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
