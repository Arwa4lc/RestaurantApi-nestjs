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
import { Role } from 'src/auth/auth.model';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
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

  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createRestaurant(
    @UploadedFile() image: Express.Multer.File,
    @Body() createRestaurantDto: CreateRestaurantDto,
  ) {
    return this.restaurantService.createRestaurant(createRestaurantDto, image);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(':restaurantID')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  updateRestaurant(
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

  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':restaurantID')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteRestaurant(@Param('restaurantID') restaurantID: string) {
    return this.restaurantService.deleteRestaurant(restaurantID);
  }
}
