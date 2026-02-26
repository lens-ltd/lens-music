import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import moment from 'moment';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { ReleaseService } from './releases.service';
import { generateCatalogNumber } from '../../helpers/strings.helper';
import { ROLES } from '../../constants/auth.constant';
import { CreateReleaseDto } from './dto/create-release.dto';

@Controller('releases')
@UseGuards(JwtAuthGuard)
export class ReleasesController {
  constructor(private readonly releaseService: ReleaseService) {}

  @Post()
  async createRelease(@Body() dto: CreateReleaseDto, @CurrentUser() user: AuthUser) {
    const { title, upc, releaseDate, version = 'original', productionYear, labelId } = dto;

    const formattedReleaseDate = moment(releaseDate).format();

    const releaseExists = await this.releaseService.checkIfReleaseExists({
      labelId: labelId as string,
      productionYear,
      releaseDate: formattedReleaseDate,
      title,
      userId: user.id,
      version: version as string,
    });

    if (releaseExists) {
      throw new ConflictException({
        message: 'Release already exists',
        data: { id: releaseExists.id },
      });
    }

    const newRelease = await this.releaseService.createRelease({
      title,
      upc: upc as string,
      releaseDate: formattedReleaseDate,
      version: version as string,
      productionYear,
      catalogNumber: generateCatalogNumber(productionYear),
      labelId: labelId as string,
      userId: user.id,
    });

    return { message: 'Release created successfully', data: newRelease };
  }

  @Get()
  async fetchReleases(
    @CurrentUser() user: AuthUser,
    @Query('size') size = '10',
    @Query('page') page = '0',
    @Query('labelId') labelId?: string,
    @Query('userId') userId?: string
  ) {
    const condition: Record<string, string | null | undefined> = {
      userId: user.role !== ROLES.ADMIN ? userId || user.id : null,
      labelId: labelId || undefined,
    };

    const releases = await this.releaseService.fetchReleases({
      size: Number(size),
      page: Number(page),
      condition,
    });

    return { message: 'Releases fetched successfully', data: releases };
  }

  @Get(':id')
  async getRelease(@Param('id') id: string) {
    const release = await this.releaseService.getReleaseById(id);
    if (!release) {
      throw new NotFoundException('Release not found');
    }

    return { message: 'Release fetched successfully', data: release };
  }
}
