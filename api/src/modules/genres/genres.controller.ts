import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../constants/permission.constants';
import { GenresService } from './genres.service';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { CreateGenreDto } from './dto/create-genre.dto';
@Controller('genres')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GenresController {
  constructor(private readonly genresService: GenresService) {}
  @Get()
  @Permissions(PERMISSIONS.READ_GENRE)
  async fetchGenres(@Query('parentId') parentId?: string) {
    const genres = await this.genresService.fetchGenres(parentId);
    return { message: 'Genres fetched successfully', data: genres };
  }
  @Post()
  @Permissions(PERMISSIONS.CREATE_GENRE)
  async createGenre(@Body() dto: CreateGenreDto, @CurrentUser() user: AuthUser) {
    const genre = await this.genresService.createGenre(dto, user);
    return { message: 'Genre created successfully', data: genre };
  }
}
