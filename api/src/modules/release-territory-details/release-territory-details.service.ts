import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReleaseTerritoryDetail } from '../../entities/release-territory-detail.entity';
import { Release } from '../../entities/release.entity';
import { CreateReleaseTerritoryDetailDto } from './dto/create-release-territory-detail.dto';
import { UpdateReleaseTerritoryDetailDto } from './dto/update-release-territory-detail.dto';
import { UUID } from '../../types/common.types';
import { ReleaseStatus } from '../../constants/release.constants';
import { isValidIso3166Alpha2 } from '../../helpers/releases.helper';

@Injectable()
export class ReleaseTerritoryDetailsService {
  constructor(
    @InjectRepository(ReleaseTerritoryDetail)
    private readonly detailRepository: Repository<ReleaseTerritoryDetail>,
    @InjectRepository(Release)
    private readonly releaseRepository: Repository<Release>,
  ) {}

  async create(
    releaseId: UUID,
    dto: CreateReleaseTerritoryDetailDto,
    createdById: UUID,
  ): Promise<ReleaseTerritoryDetail> {
    await this.ensureRelease(releaseId);
    const code = dto.territory.toUpperCase().trim();
    if (!isValidIso3166Alpha2(code)) {
      throw new BadRequestException(`Invalid territory code: ${dto.territory}`);
    }
    const exists = await this.detailRepository.findOne({
      where: { releaseId, territory: code },
    });
    if (exists) {
      throw new ConflictException(
        'A territory detail for this territory already exists',
      );
    }
    const row = this.detailRepository.create({
      releaseId,
      territory: code,
      title: dto.title?.trim() || undefined,
      displayArtistName: dto.displayArtistName?.trim() || undefined,
      labelName: dto.labelName?.trim() || undefined,
      createdById,
    });
    const saved = await this.detailRepository.save(row);
    await this.resetValidatedReleaseToDraft(releaseId);
    return saved;
  }

  async findByReleaseId(releaseId: UUID): Promise<ReleaseTerritoryDetail[]> {
    return this.detailRepository.find({
      where: { releaseId },
      order: { territory: 'ASC' },
    });
  }

  async update(
    releaseId: UUID,
    id: UUID,
    dto: UpdateReleaseTerritoryDetailDto,
  ): Promise<ReleaseTerritoryDetail> {
    const row = await this.detailRepository.findOne({
      where: { id, releaseId },
    });
    if (!row) {
      throw new NotFoundException('Territory detail not found');
    }
    if (dto.territory !== undefined) {
      const code = dto.territory.toUpperCase().trim();
      if (!isValidIso3166Alpha2(code)) {
        throw new BadRequestException(`Invalid territory code: ${dto.territory}`);
      }
      if (code !== row.territory) {
        const clash = await this.detailRepository.findOne({
          where: { releaseId, territory: code },
        });
        if (clash) {
          throw new ConflictException(
            'A territory detail for this territory already exists',
          );
        }
      }
      row.territory = code;
    }
    if (dto.title !== undefined) row.title = dto.title?.trim() || undefined;
    if (dto.displayArtistName !== undefined) {
      row.displayArtistName = dto.displayArtistName?.trim() || undefined;
    }
    if (dto.labelName !== undefined) {
      row.labelName = dto.labelName?.trim() || undefined;
    }
    const saved = await this.detailRepository.save(row);
    await this.resetValidatedReleaseToDraft(releaseId);
    return saved;
  }

  async delete(releaseId: UUID, id: UUID): Promise<void> {
    const row = await this.detailRepository.findOne({
      where: { id, releaseId },
    });
    if (!row) {
      throw new NotFoundException('Territory detail not found');
    }
    await this.detailRepository.delete(id);
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
