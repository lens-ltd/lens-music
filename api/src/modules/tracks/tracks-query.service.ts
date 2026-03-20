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

  private normalizeTrack(track: Track | null): Track | null {
    if (!track) return track;

    if (typeof track.primaryLanguage === 'string') {
      track.primaryLanguage = track.primaryLanguage.trim();
    }

    return track;
  }

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

    return getPagingData({
      data: [tracks[0].map((track) => this.normalizeTrack(track)), tracks[1]],
      size,
      page,
    });
  }

  async getTrackById(id: UUID): Promise<Track | null> {
    return this.normalizeTrack(
      await this.trackRepository.findOne({
        where: { id },
        relations: ["audioFiles", "trackContributors", "trackContributors.contributor"],
      }),
    );
  }
}
