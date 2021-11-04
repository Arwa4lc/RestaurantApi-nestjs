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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from 'src/auth/auth.model';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@ApiTags('City')
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @ApiOkResponse({ description: 'Success' })
  @Get()
  getAll() {
    return this.cityService.getAll();
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'City not found' })
  @Get(':cityId')
  getById(@Param('cityId') cityId: string) {
    return this.cityService.getById(cityId);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Document created' })
  @ApiBadRequestResponse({ description: 'BadRequest: something went wrong' })
  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  createCity(@Body() createCityDto: CreateCityDto) {
    return this.cityService.createCity(createCityDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Document updated' })
  @ApiNotFoundResponse({ description: 'City not found' })
  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(':cityId')
  @HttpCode(HttpStatus.OK)
  updateCity(
    @Param('cityId') cityId: string,
    @Body() updateCityDto: UpdateCityDto,
  ) {
    return this.cityService.updateCity(cityId, updateCityDto);
  }

  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'No content' })
  @ApiNotFoundResponse({ description: 'City not found' })
  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':cityId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteCity(@Param('cityId') cityId: string) {
    return this.cityService.deleteCity(cityId);
  }
}
