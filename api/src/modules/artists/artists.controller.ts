import {
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
import { ArtistService } from './artists.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { ROLES } from '../../constants/auth.constant';
import { STATUSES } from '../../constants/artist.constants';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artists')
@UseGuards(JwtAuthGuard)
export class ArtistsController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  async createArtist(@Body() dto: CreateArtistDto, @CurrentUser() user: AuthUser) {
    const newArtist = await this.artistService.createArtist({ ...dto, userId: user.id });
    return { message: 'Artist created successfully', data: newArtist };
  }

  @Get()
  async fetchArtists(
    @Query('size') size = '10',
    @Query('page') page = '0',
    @Query('labelId') labelId: string | undefined,
    @CurrentUser() user: AuthUser,
  ) {
    let condition: Record<string, unknown> = {};
    if (user?.role !== ROLES.ADMIN) {
      condition = { ...condition, userId: user.id, status: STATUSES.ACTIVE };
    }
    if (labelId) condition = { ...condition, labelId };

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
    if (!artist) throw new NotFoundException('Artist not found');
    if (user?.role !== ROLES.ADMIN && artist.status !== STATUSES.ACTIVE) {
      throw new ForbiddenException('Forbidden');
    }
    return { message: 'Artist fetched successfully', data: artist };
  }

  @Patch(':id')
  async updateArtist(
    @Param('id') id: string,
    @Body() dto: UpdateArtistDto,
    @CurrentUser() user: AuthUser,
  ) {
    const artist = await this.artistService.getArtistById(id);
    if (!artist) throw new NotFoundException('Artist not found');
    if (user?.role !== ROLES.ADMIN && artist.status !== STATUSES.ACTIVE) {
      throw new ForbiddenException('Forbidden');
    }

    const updatedArtist = await this.artistService.updateArtist({
      id,
      name: dto.name || artist.name,
      status: dto.status || artist.status,
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
