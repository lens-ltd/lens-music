import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GenresService } from './genres.service';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { CreateGenreDto } from './dto/create-genre.dto';

@Controller('genres')
@UseGuards(JwtAuthGuard)
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  async fetchGenres(@Query('parentId') parentId?: string) {
    const genres = await this.genresService.fetchGenres(parentId);
    return { message: 'Genres fetched successfully', data: genres };
  }

  @Post()
  async createGenre(@Body() dto: CreateGenreDto, @CurrentUser() user: AuthUser) {
    const genre = await this.genresService.createGenre(dto, user);
    return { message: 'Genre created successfully', data: genre };
  }
}
