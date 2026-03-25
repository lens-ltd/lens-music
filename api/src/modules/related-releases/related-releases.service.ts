import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RelatedRelease } from '../../entities/related-release.entity';
import { Release } from '../../entities/release.entity';
import { CreateRelatedReleaseDto } from './dto/create-related-release.dto';
import { UpdateRelatedReleaseDto } from './dto/update-related-release.dto';
import { UUID } from '../../types/common.types';
import { ReleaseStatus } from '../../constants/release.constants';

@Injectable()
export class RelatedReleasesService {
  constructor(
    @InjectRepository(RelatedRelease)
    private readonly relatedReleaseRepository: Repository<RelatedRelease>,
    @InjectRepository(Release)
    private readonly releaseRepository: Repository<Release>,
  ) {}

  async create(
    releaseId: UUID,
    dto: CreateRelatedReleaseDto,
    createdById: UUID,
  ): Promise<RelatedRelease> {
    await this.ensureRelease(releaseId);
    if (!dto.relatedReleaseId?.trim() && !dto.externalId?.trim()) {
      throw new BadRequestException(
        'Either relatedReleaseId or externalId is required',
      );
    }
    if (dto.relatedReleaseId) {
      if (dto.relatedReleaseId === releaseId) {
        throw new BadRequestException('A release cannot relate to itself');
      }
      const target = await this.releaseRepository.findOne({
        where: { id: dto.relatedReleaseId },
      });
      if (!target) {
        throw new NotFoundException('Related release not found');
      }
    }
    const row = this.relatedReleaseRepository.create({
      releaseId,
      relatedReleaseId: dto.relatedReleaseId || undefined,
      relationType: dto.relationType,
      externalId: dto.externalId?.trim() || undefined,
      createdById,
    });
    const saved = await this.relatedReleaseRepository.save(row);
    await this.resetValidatedReleaseToDraft(releaseId);
    return this.relatedReleaseRepository.findOneOrFail({
      where: { id: saved.id },
      relations: ['relatedRelease'],
    });
  }

  async findByReleaseId(releaseId: UUID): Promise<RelatedRelease[]> {
    return this.relatedReleaseRepository.find({
      where: { releaseId },
      relations: ['relatedRelease'],
      order: { createdAt: 'ASC' },
    });
  }

  async update(
    releaseId: UUID,
    id: UUID,
    dto: UpdateRelatedReleaseDto,
  ): Promise<RelatedRelease> {
    const row = await this.relatedReleaseRepository.findOne({
      where: { id, releaseId },
    });
    if (!row) {
      throw new NotFoundException('Related release link not found');
    }
    if (dto.relatedReleaseId !== undefined) {
      if (dto.relatedReleaseId === releaseId) {
        throw new BadRequestException('A release cannot relate to itself');
      }
      if (dto.relatedReleaseId) {
        const target = await this.releaseRepository.findOne({
          where: { id: dto.relatedReleaseId },
        });
        if (!target) {
          throw new NotFoundException('Related release not found');
        }
      }
      row.relatedReleaseId = dto.relatedReleaseId || undefined;
    }
    if (dto.relationType !== undefined) {
      row.relationType = dto.relationType;
    }
    if (dto.externalId !== undefined) {
      row.externalId = dto.externalId?.trim() || undefined;
    }
    const relatedId = row.relatedReleaseId;
    const ext = row.externalId;
    if (!relatedId && !ext?.trim()) {
      throw new BadRequestException(
        'Either relatedReleaseId or externalId is required',
      );
    }
    const saved = await this.relatedReleaseRepository.save(row);
    await this.resetValidatedReleaseToDraft(releaseId);
    return this.relatedReleaseRepository.findOneOrFail({
      where: { id: saved.id },
      relations: ['relatedRelease'],
    });
  }

  async delete(releaseId: UUID, id: UUID): Promise<void> {
    const row = await this.relatedReleaseRepository.findOne({
      where: { id, releaseId },
    });
    if (!row) {
      throw new NotFoundException('Related release link not found');
    }
    await this.relatedReleaseRepository.delete(id);
    await this.resetValidatedReleaseToDraft(releaseId);
  }

  private async ensureRelease(releaseId: UUID): Promise<void> {
    const release = await this.releaseRepository.findOne({
      where: { id: releaseId },
    });
    if (!release) {
      throw new NotFoundException('Release not found');
    }
  }

  private async resetValidatedReleaseToDraft(releaseId: UUID): Promise<void> {
    const release = await this.releaseRepository.findOne({
      where: { id: releaseId },
    });
    if (release?.status === ReleaseStatus.VALIDATED) {
      await this.releaseRepository.update(releaseId, {
        status: ReleaseStatus.DRAFT,
      });
    }
  }
}
