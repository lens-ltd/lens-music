import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Release } from '../../entities/release.entity';
import { getPagination, getPagingData, Pagination } from '../../helpers/pagination.helper';
import { UUID } from '../../types/common.types';
import { ReleaseStatus } from '../../constants/release.constants';

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
    status,
    digitalReleaseDateFrom,
    digitalReleaseDateTo,
  }: {
    createdById?: UUID;
    size?: number;
    page?: number;
    status?: ReleaseStatus;
    digitalReleaseDateFrom?: string;
    digitalReleaseDateTo?: string;
  }): Promise<Pagination> {
    const { take, skip } = getPagination({ size, page });
    const query = this.releaseRepository
      .createQueryBuilder('release')
      .leftJoinAndSelect('release.createdBy', 'createdBy')
      .leftJoinAndSelect('release.genres', 'releaseGenre')
      .leftJoinAndSelect('releaseGenre.genre', 'genre')
      .orderBy('release.createdAt', 'DESC')
      .take(take)
      .skip(skip);

    if (createdById) {
      query.andWhere('release.createdById = :createdById', { createdById });
    }
    if (status) {
      query.andWhere('release.status = :status', { status });
    }
    if (digitalReleaseDateFrom) {
      query.andWhere('release.digitalReleaseDate >= :digitalReleaseDateFrom', {
        digitalReleaseDateFrom,
      });
    }
    if (digitalReleaseDateTo) {
      query.andWhere('release.digitalReleaseDate <= :digitalReleaseDateTo', {
        digitalReleaseDateTo,
      });
    }

    const releases = await query.getManyAndCount();

    return getPagingData({ data: releases, size, page });
  }

  async fetchReviewQueue({
    status,
    size,
    page,
  }: {
    status?: ReleaseStatus;
    size?: number;
    page?: number;
  }): Promise<Pagination> {
    const { take, skip } = getPagination({ size, page });
    const releases = await this.releaseRepository.findAndCount({
      where: { status: status ?? ReleaseStatus.REVIEW },
      order: { createdAt: 'ASC' },
      take,
      skip,
      relations: {
        createdBy: true,
        genres: { genre: true },
      },
    });

    return getPagingData({ data: releases, size, page });
  }

  async getReleaseById(id: UUID): Promise<Release | null> {
    return this.releaseRepository.findOne({
      where: { id },
      relations: {
        createdBy: true,
        tracks: { audioFiles: true, trackContributors: { contributor: true } },
        genres: { genre: { parent: true } },
      },
    });
  }
}
