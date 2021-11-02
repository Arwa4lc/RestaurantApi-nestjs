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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/auth.model';
import { GetUser } from 'src/common/decorators/admin.decorator';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@ApiTags('City')
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  getAll() {
    return this.cityService.getAll();
  }

  @Get(':cityId')
  getById(@Param('cityId') cityId: string) {
    return this.cityService.getById(cityId);
  }

  @Post()
  @UseGuards(AuthGuard())
  createCity(@GetUser() user: User, @Body() createCityDto: CreateCityDto) {
    return this.cityService.createCity(createCityDto);
  }

  @Patch(':cityId')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  updateCity(
    @GetUser() user: User,
    @Param('cityId') cityId: string,
    @Body() updateCityDto: UpdateCityDto,
  ) {
    return this.cityService.updateCity(cityId, updateCityDto);
  }

  @Delete(':cityId')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteCity(@GetUser() user: User, @Param('cityId') cityId: string) {
    return this.cityService.deleteCity(cityId);
  }
}
