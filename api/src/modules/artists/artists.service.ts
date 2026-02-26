import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from '../../entities/artist.entity';
import { getPagination, getPagingData } from '../../helpers/pagination.helper';
import { UUID } from '../../types/common.types';
import { ArtistPagination } from '../../types/models/artist.types';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}

  // CREATE ARTIST
  async createArtist({
    name,
    status,
    userId,
  }: {
    name: string;
    status?: string;
    userId: UUID;
  }): Promise<Artist> {
    const newArtist = this.artistRepository.create({ name, status, userId });
    return this.artistRepository.save(newArtist);
  }

  // FETCH ALL ARTISTS
  async fetchArtists({
    condition,
    size,
    page,
  }: {
    condition?: object;
    size?: number;
    page?: number;
  }): Promise<ArtistPagination> {
    const { take, skip } = getPagination({ size, page });
    const artists = await this.artistRepository.findAndCount({
      where: condition,
      take,
      skip,
      relations: ['user'],
    });
    return getPagingData({ data: artists, size, page });
  }

  // GET ARTIST BY ID
  async getArtistById(id: UUID): Promise<Artist | null> {
    return this.artistRepository.findOne({ where: { id }, relations: ['user'] });
  }

  // UPDATE ARTIST
  async updateArtist({
    id,
    name,
    status,
    userId,
  }: {
    id: UUID;
    name: string;
    status: string;
    userId: UUID;
  }): Promise<Artist> {
    return this.artistRepository.save({ id, name, status, userId });
  }

  // DELETE ARTIST
  async deleteArtist(id: UUID) {
    return this.artistRepository.delete(id);
  }
}
