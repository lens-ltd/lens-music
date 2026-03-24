import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Release } from '../../entities/release.entity';
import { getPagination, getPagingData, Pagination } from '../../helpers/pagination.helper';
import { UUID } from '../../types/common.types';

@Injectable()
export class ReleaseQueryService {
  constructor(
    @InjectRepository(Release)
    private readonly releaseRepository: Repository<Release>,
  ) {}

  async fetchAllReleases({
    createdById,
    size,
    page,
  }: {
    createdById?: UUID;
    size?: number;
    page?: number;
  }): Promise<Pagination> {
    const { take, skip } = getPagination({ size, page });
    const releases = await this.releaseRepository.findAndCount({
      where: createdById ? { createdById } : {},
      order: { createdAt: 'DESC' },
      take,
      skip,
      relations: {
        createdBy: true,
      }
    });

    return getPagingData({ data: releases, size, page });
  }

  async getReleaseById(id: UUID): Promise<Release | null> {
    return this.releaseRepository.findOne({
      where: { id },
      relations: {
        createdBy: true,
        tracks: { audioFiles: true, trackContributors: { contributor: true } },
      },
    });
  }
}
