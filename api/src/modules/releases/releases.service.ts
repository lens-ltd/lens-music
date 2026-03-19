import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Release } from '../../entities/release.entity';
import { CreateReleaseDto } from './dto/create-release.dto';
import { UUID } from '../../types/common.types';

@Injectable()
export class ReleaseService {
  constructor(
    @InjectRepository(Release)
    private readonly releaseRepository: Repository<Release>,
  ) { }

  async createRelease(dto: CreateReleaseDto, userId: UUID): Promise<Release> {
    const release = this.releaseRepository.create({
      title: dto.title,
      type: dto.type,
      createdById: userId,
    });

    return this.releaseRepository.save(release);
  }
}
