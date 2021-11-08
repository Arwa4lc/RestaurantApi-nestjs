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
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
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

  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'BadRequest: something went wrong' })
  @ApiNotFoundResponse({ description: 'No results found' })
  @Get('statistics')
  getStatistics() {
    return this.restaurantService.getStatistics();
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'BadRequest: something went wrong' })
  @ApiNotFoundResponse({ description: 'No results found' })
  @ApiQuery({ name: 'name', type: 'string', required: false })
  @ApiQuery({ name: 'longitude', type: 'number', required: false })
  @ApiQuery({ name: 'latitude', type: 'number', required: false })
  @Get()
  getAll(@Query() query) {
    return this.restaurantService.getAll(query);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Restaurant not found' })
  @Get(':restaurantID')
  getById(@Param('restaurantID') restaurantID: string) {
    return this.restaurantService.getById(restaurantID);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'Document created' })
  @ApiNotFoundResponse({ description: 'City with given ID not found' })
  @ApiConflictResponse({
    description: "Conflict: Request couldn't be processed",
  })
  @ApiBadRequestResponse({ description: 'BadRequest: something went wrong' })
  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createRestaurant(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.restaurantService.createRestaurant(createRestaurantDto, image);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ description: 'Document updated' })
  @ApiNotFoundResponse({ description: 'Restaurant not found' })
  @ApiBadRequestResponse({ description: 'BadRequest: something went wrong' })
  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(':restaurantID')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  updateRestaurant(
    @Param('restaurantID') restaurantID: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.restaurantService.updateRestaurant(
      restaurantID,
      updateRestaurantDto,
      image,
    );
  }

  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'No content' })
  @ApiNotFoundResponse({ description: 'Restaurant not found' })
  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':restaurantID')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteRestaurant(@Param('restaurantID') restaurantID: string) {
    return this.restaurantService.deleteRestaurant(restaurantID);
  }
}
