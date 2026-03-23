import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Lyrics } from '../../entities/lyrics.entity';
import { UUID } from '../../types/common.types';
import { getPagination, getPagingData, Pagination } from '../../helpers/pagination.helper';

@Injectable()
export class LyricsService {
  constructor(
    @InjectRepository(Lyrics)
    private readonly lyricsRepository: Repository<Lyrics>,
  ) {}

  // CREATE LYRICS
  async createLyrics(lyrics: Partial<Lyrics>): Promise<Lyrics> {
    return this.lyricsRepository.save(lyrics);
  }

  // FETCH LYRICS
  async fetchLyrics(
    condition: FindOptionsWhere<Lyrics> | FindOptionsWhere<Lyrics>[],
    size: number,
    page: number,
  ): Promise<Pagination> {
    const { take, skip } = getPagination({ size, page });
    const lyrics = await this.lyricsRepository.findAndCount({
      where: condition,
      order: { createdAt: 'DESC' },
      take,
      skip,
    });
    return getPagingData({ data: lyrics, size, page });
  }

  // GET LYRICS BY ID
  async getLyricsById(id: UUID): Promise<Lyrics> {
    const lyrics = await this.lyricsRepository.findOneBy({ id });
    if (!lyrics) throw new NotFoundException('Lyrics not found');
    return lyrics;
  }

  // UPDATE LYRICS
  async updateLyrics(id: UUID, payload: Partial<Lyrics>): Promise<Lyrics> {
    const lyrics = await this.getLyricsById(id);
    Object.assign(lyrics, payload);
    return this.lyricsRepository.save(lyrics);
  }

  // DELETE LYRICS
  async deleteLyrics(id: UUID): Promise<void> {
    const result = await this.lyricsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Lyrics not found');
    }
  }
}

