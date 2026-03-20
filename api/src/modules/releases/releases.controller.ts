import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateReleaseDto } from './dto/create-release.dto';
import { ReleaseService } from './releases.service';
import { ReleaseQueryService } from './releases-query.service';
import { memoryStorage } from 'multer';

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

  @Post(':id/cover-art')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async uploadReleaseCoverArt(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @CurrentUser() user: AuthUser,
  ) {
    const release = await this.releaseService.uploadCoverArt(id, file, user);
    return { message: 'Release cover art uploaded successfully', data: release };
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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRelease(@Param('id') id: string) {
    await this.releaseService.deleteRelease(id);
  }
}
