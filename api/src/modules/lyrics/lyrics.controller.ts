import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LyricsService } from './lyrics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Lyrics } from '../../entities/lyrics.entity';

@Controller('lyrics')
@UseGuards(JwtAuthGuard)
export class LyricsController {
  constructor(private readonly lyricsService: LyricsService) {}

  @Post()
  async createLyrics(@Body() body: Partial<Lyrics>) {
    const lyrics = await this.lyricsService.createLyrics(body);
    return { message: 'Lyrics created successfully', data: lyrics };
  }

  @Get()
  async fetchLyrics(
    @Query('size') size = '10',
    @Query('page') page = '0',
    @Query('trackId') trackId?: string,
  ) {
    const condition = trackId ? { trackId: trackId as any } : {};
    const lyrics = await this.lyricsService.fetchLyrics(condition, Number(size), Number(page));
    return { message: 'Lyrics fetched successfully', data: lyrics };
  }

  @Get(':id')
  async getLyricsById(@Param('id') id: string) {
    const lyrics = await this.lyricsService.getLyricsById(id);
    return { message: 'Lyrics fetched successfully', data: lyrics };
  }
}
