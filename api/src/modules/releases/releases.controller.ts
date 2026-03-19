import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateReleaseDto } from './dto/create-release.dto';
import { ReleaseService } from './releases.service';
import { ReleaseQueryService } from './releasesQuery.service';

@Controller('releases')
@UseGuards(JwtAuthGuard)
export class ReleasesController {
  constructor(
    private readonly releaseService: ReleaseService,
    private readonly releaseQueryService: ReleaseQueryService,
  ) {}

  @Post()
  async createRelease(@Body() dto: CreateReleaseDto, @CurrentUser() user: AuthUser) {
    const release = await this.releaseService.createRelease(dto, user.id);
    return { message: 'Release created successfully', data: release };
  }

  @Get()
  async fetchAllReleases(
    @Query('createdById') createdById?: string,
    @Query('size') size = '10',
    @Query('page') page = '0',
  ) {
    const releases = await this.releaseQueryService.fetchAllReleases({
      createdById,
      size: Number(size),
      page: Number(page),
    });
    return { message: 'Releases fetched successfully', data: releases };
  }

  @Get(':id')
  async getReleaseById(@Param('id') id: string) {
    const release = await this.releaseQueryService.getReleaseById(id);
    if (!release) {
      throw new NotFoundException('Release not found');
    }
    return { message: 'Release fetched successfully', data: release };
  }
}
