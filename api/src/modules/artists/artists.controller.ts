import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArtistService } from '../../services/artist.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { ROLES } from '../../constants/auth.constant';
import { STATUSES } from '../../constants/artist.constants';

@Controller('artists')
@UseGuards(JwtAuthGuard)
export class ArtistsController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  async createArtist(
    @Body() body: { name: string; status: string },
    @CurrentUser() user: AuthUser
  ) {
    const { name, status } = body;
    if (!name) {
      throw new BadRequestException('Name is required');
    }

    const newArtist = await this.artistService.createArtist({
      name,
      status,
      userId: user.id,
    });

    return { message: 'Artist created successfully', data: newArtist };
  }

  @Get()
  async fetchArtists(
    @Query('size') size = '10',
    @Query('page') page = '0',
    @Query('labelId') labelId: string | undefined,
    @CurrentUser() user: AuthUser
  ) {
    let condition: Record<string, unknown> = {};

    if (user?.role !== ROLES.ADMIN) {
      condition = { ...condition, userId: user.id, status: STATUSES.ACTIVE };
    }

    if (labelId) {
      condition = { ...condition, labelId };
    }

    const artists = await this.artistService.fetchArtists({
      condition,
      size: Number(size),
      page: Number(page),
    });

    return { message: 'Artists fetched successfully', data: artists };
  }

  @Get(':id')
  async getArtistById(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const artist = await this.artistService.getArtistById(id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    if (user?.role !== ROLES.ADMIN && artist.status !== STATUSES.ACTIVE) {
      throw new ForbiddenException('Forbidden');
    }

    return { message: 'Artist fetched successfully', data: artist };
  }

  @Patch(':id')
  async updateArtist(
    @Param('id') id: string,
    @Body() body: { name: string; status: string },
    @CurrentUser() user: AuthUser
  ) {
    const { name, status } = body;

    if (!name) {
      throw new BadRequestException('Name is required');
    }

    const artist = await this.artistService.getArtistById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    if (user?.role !== ROLES.ADMIN && artist.status !== STATUSES.ACTIVE) {
      throw new ForbiddenException('Forbidden');
    }

    const updatedArtist = await this.artistService.updateArtist({
      id,
      name: name || artist.name,
      status: status || artist.status,
      userId: artist.userId,
    });

    return { message: 'Artist updated successfully', data: updatedArtist };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtist(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    if (user?.role !== ROLES.ADMIN && user?.id !== id) {
      throw new ForbiddenException('Forbidden');
    }

    await this.artistService.deleteArtist(id);
  }
}
