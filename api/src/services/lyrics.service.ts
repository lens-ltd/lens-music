import { FindOptionsWhere, Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Lyrics } from '../entities/lyrics.entity';
import { UUID } from '../types/common.types';
import {
  getPagination,
  getPagingData,
  Pagination,
} from '../helpers/pagination.helper';
import { NotFoundError } from '../helpers/errors.helper';
export class LyricsService {
  private lyricsRepository: Repository<Lyrics>;

  constructor() {
    this.lyricsRepository = AppDataSource.getRepository(Lyrics);
  }

  // CREATE LYRICS
  async createLyrics(lyrics: Partial<Lyrics>): Promise<Lyrics> {
    return this.lyricsRepository.save(lyrics);
  }

  // FETCH LYRICS
  async fetchLyrics(
    condition: FindOptionsWhere<Lyrics> | FindOptionsWhere<Lyrics>[],
    size: number,
    page: number
  ): Promise<Pagination> {
    const { take, skip } = getPagination({ size, page });
    const lyrics = await this.lyricsRepository.findAndCount({
      where: condition,
      take,
      skip,
    });
    return getPagingData({ data: lyrics, size, page });
  }

  // GET LYRICS BY ID
  async getLyricsById(id: UUID): Promise<Lyrics> {
    const lyrics = await this.lyricsRepository.findOneBy({ id });
    if (!lyrics) {
      throw new NotFoundError('Lyrics not found');
    }
    return lyrics;
  }
}
