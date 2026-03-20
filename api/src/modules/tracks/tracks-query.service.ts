import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Track } from '../../entities/track.entity';
import { UUID } from '../../types/common.types';
import { getPagination, getPagingData, Pagination } from '../../helpers/pagination.helper';

@Injectable()
export class TrackQueryService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  async fetchAllTracks({
    releaseId,
    size,
    page,
  }: {
    releaseId?: UUID;
    size?: number;
    page?: number;
  }): Promise<Pagination> {
    const { take, skip } = getPagination({ size, page });
    const where: FindOptionsWhere<Track> = releaseId ? { releaseId } : {};

    const tracks = await this.trackRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take,
      skip,
    });

    return getPagingData({ data: tracks, size, page });
  }

  async getTrackById(id: UUID): Promise<Track | null> {
    return this.trackRepository.findOne({ where: { id } });
  }
}
