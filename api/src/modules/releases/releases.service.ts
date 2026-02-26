import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Release } from '../../entities/release.entity';
import { getPagination, getPagingData } from '../../helpers/pagination.helper';
import { UUID } from '../../types/common.types';
import { ReleasePagination } from '../../types/models/release.types';

@Injectable()
export class ReleaseService {
  constructor(
    @InjectRepository(Release)
    private readonly releaseRepository: Repository<Release>,
  ) {}

  // CREATE RELEASE
  async createRelease({
    title,
    upc,
    releaseDate,
    version,
    productionYear,
    catalogNumber,
    labelId,
    userId,
  }: {
    title: string;
    upc: string;
    releaseDate: string;
    version: string;
    productionYear: number;
    catalogNumber: string;
    labelId: UUID;
    userId: UUID;
  }): Promise<Release> {
    const newRelease = this.releaseRepository.create({
      title,
      upc,
      releaseDate,
      version,
      productionYear,
      catalogNumber,
      labelId,
      userId,
    });

    return this.releaseRepository.save(newRelease);
  }

  // FETCH RELEASES
  async fetchReleases({
    size,
    page,
    condition,
  }: {
    size: number;
    page: number;
    condition: object;
  }): Promise<ReleasePagination> {
    const { take, skip } = getPagination({ page, size });
    const releases = await this.releaseRepository.findAndCount({
      take,
      skip,
      order: { updatedAt: 'DESC' },
      relations: ['label', 'user'],
      where: condition,
    });
    return getPagingData({ data: releases, size, page });
  }

  // CHECK RELEASE DUPLICATION
  async checkIfReleaseExists({
    labelId,
    userId,
    version,
    productionYear,
    title,
    releaseDate,
  }: {
    labelId: UUID;
    userId: UUID;
    version?: string;
    productionYear: number;
    title: string;
    releaseDate: string;
  }): Promise<Release | null> {
    return this.releaseRepository.findOne({
      where: { labelId, userId, version, productionYear, title, releaseDate },
    });
  }

  // GET RELEASE BY ID
  async getReleaseById(id: UUID): Promise<Release | null> {
    return this.releaseRepository.findOne({
      where: { id },
      relations: ['label', 'user'],
    });
  }

  // UPDATE RELEASE
  async updateRelease({
    id,
    title,
    upc,
    releaseDate,
    version,
    productionYear,
    labelId,
  }: {
    id: UUID;
    title: string;
    upc: string;
    releaseDate: string;
    version: string;
    productionYear: number;
    labelId: UUID;
  }): Promise<Release | null> {
    await this.releaseRepository.update(id as string, {
      title,
      upc,
      releaseDate,
      version,
      productionYear,
      labelId,
    });
    return this.releaseRepository.findOne({ where: { id } });
  }
}
