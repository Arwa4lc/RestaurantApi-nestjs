import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/auth.model';
import { GetUser } from 'src/common/decorators/admin.decorator';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantService } from './restaurant.service';

@ApiTags('Restaurant')
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get('statistics')
  getStatistics() {
    return this.restaurantService.getStatistics();
  }

  @Get()
  getAll(@Query() query) {
    return this.restaurantService.getAll(query);
  }

  @Get(':restaurantID')
  getById(@Param('restaurantID') restaurantID: string) {
    return this.restaurantService.getById(restaurantID);
  }

  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  async createRestaurant(
    @GetUser() user: User,
    @UploadedFile() image: Express.Multer.File,
    @Body() createRestaurantDto: CreateRestaurantDto,
  ) {
    return this.restaurantService.createRestaurant(createRestaurantDto, image);
  }

  @Patch(':restaurantID')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  updateRestaurant(
    @GetUser() user: User,
    @UploadedFile() image: Express.Multer.File,
    @Param('restaurantID') restaurantID: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantService.updateRestaurant(
      restaurantID,
      updateRestaurantDto,
      image,
    );
  }

  @Delete(':restaurantID')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteRestaurant(
    @GetUser() user: User,
    @Param('restaurantID') restaurantID: string,
  ) {
    return this.restaurantService.deleteRestaurant(restaurantID);
  }
}
