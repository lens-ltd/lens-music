import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Release } from '../../entities/release.entity';
import { ReleaseContributor } from '../../entities/release-contributor.entity';
import { TrackStatus } from '../../entities/track.entity';
import { CreateReleaseDto } from './dto/create-release.dto';
import { UUID } from '../../types/common.types';
import { generateCatalogNumber } from '../../helpers/releases.helper';
import { CloudinaryImageUploaderService } from '../uploads/cloudinary-image-uploader.service';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { ROLES } from '../../constants/auth.constant';
import { ReleaseStatus } from '../../constants/release.constants';
import { ContributorRole } from '../../constants/contributor.constants';
import { UpdateReleaseOverviewDto } from './dto/update-release-overview.dto';
import { UpdateReleaseTerritoriesDto } from './dto/update-release-territories.dto';

@Injectable()
export class ReleaseService {
  constructor(
    @InjectRepository(Release)
    private readonly releaseRepository: Repository<Release>,
    @InjectRepository(ReleaseContributor)
    private readonly releaseContributorRepository: Repository<ReleaseContributor>,
    private readonly cloudinaryImageUploaderService: CloudinaryImageUploaderService,
  ) { }

  async createRelease(dto: CreateReleaseDto, userId: UUID): Promise<Release> {
    const release = this.releaseRepository.create({
      title: dto.title,
      type: dto.type,
      createdById: userId,
      catalogNumber: generateCatalogNumber(),
    });

    return this.releaseRepository.save(release);
  }

  async updateOverview(
    id: UUID,
    dto: UpdateReleaseOverviewDto,
    user: AuthUser,
  ): Promise<Release> {
    const release = await this.getAuthorizedRelease(id, user);

    release.title = dto.title.trim();
    release.type = dto.type;
    release.titleVersion = dto.titleVersion?.trim() || undefined;
    release.version = dto.version?.trim() || undefined;
    release.productionYear = dto.productionYear;
    release.originalReleaseDate = dto.originalReleaseDate;
    release.digitalReleaseDate = dto.digitalReleaseDate;
    release.preorderDate = dto.preorderDate || undefined;
    release.cLine = {
      year: dto.cLine.year,
      owner: dto.cLine.owner.trim(),
    };
    release.pLine = {
      year: dto.pLine.year,
      owner: dto.pLine.owner.trim(),
    };
    release.parentalAdvisory = dto.parentalAdvisory;
    release.primaryLanguage = dto.primaryLanguage.trim();

    return this.releaseRepository.save(release);
  }


  async updateTerritories(
    id: UUID,
    dto: UpdateReleaseTerritoriesDto,
    user: AuthUser,
  ): Promise<Release> {
    const release = await this.getAuthorizedRelease(id, user);

    release.territories = dto.territories;

    return this.releaseRepository.save(release);
  }

  async uploadCoverArt(
    id: UUID,
    file: Express.Multer.File | undefined,
    user: AuthUser,
  ): Promise<Release> {
    const release = await this.getAuthorizedRelease(id, user);

    const uploadedCoverArt = await this.cloudinaryImageUploaderService.uploadImage({
      file,
      folder: 'lens-music/releases/cover-art',
    });

    release.coverArtUrl = uploadedCoverArt.secureUrl;

    return this.releaseRepository.save(release);
  }

  // DELETE RELEASE
  async deleteRelease(id: UUID): Promise<void> {
    const result = await this.releaseRepository.delete(id);
    if (result?.affected === 0) {
      throw new NotFoundException('Release not found');
    }
  }

  async validateRelease(
    id: UUID,
    user: AuthUser,
  ): Promise<{ valid: boolean; errors: string[] }> {
    await this.getAuthorizedRelease(id, user);

    const release = await this.releaseRepository.findOne({
      where: { id },
      relations: {
        tracks: { audioFiles: true, trackContributors: true },
      },
    });

    if (!release) {
      throw new NotFoundException('Release not found');
    }

    const errors: string[] = [];

    if (!release.title) {
      errors.push('Title is required');
    }

    if (!release.type) {
      errors.push('Release type is required');
    }

    if (!release.primaryLanguage) {
      errors.push('Primary language is required');
    }

    if (!release.cLine?.year || !release.cLine?.owner) {
      errors.push('C-line (year and owner) is required');
    }

    if (!release.pLine?.year || !release.pLine?.owner) {
      errors.push('P-line (year and owner) is required');
    }

    if (!release.coverArtUrl) {
      errors.push('Cover art is required');
    }

    if (!release.originalReleaseDate) {
      errors.push('Original release date is required');
    }

    if (!release.digitalReleaseDate) {
      errors.push('Digital release date is required');
    }

    if (!release.productionYear) {
      errors.push('Production year is required');
    }

    if (!release.territories || release.territories.length === 0) {
      errors.push('At least one territory is required');
    }

    if (!release.tracks || release.tracks.length === 0) {
      errors.push('At least one track is required');
    } else {
      for (const track of release.tracks) {
        if (track.status !== TrackStatus.VALIDATED) {
          errors.push(`Track "${track.title}" is not validated`);
        }
      }
    }

    const primaryArtist = await this.releaseContributorRepository.findOne({
      where: { releaseId: id, role: ContributorRole.PRIMARY_ARTIST },
    });

    if (!primaryArtist) {
      errors.push('At least one primary artist contributor is required');
    }

    if (errors.length === 0) {
      release.status = ReleaseStatus.REVIEW;
      await this.releaseRepository.save(release);
    }

    return { valid: errors.length === 0, errors };
  }

  private async getAuthorizedRelease(id: UUID, user: AuthUser): Promise<Release> {
    const release = await this.releaseRepository.findOne({ where: { id } });

    if (!release) {
      throw new NotFoundException('Release not found');
    }

    const isOwner = release.createdById === user.id;
    const isAdmin = user.role === ROLES.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Forbidden');
    }

    return release;
  }
}
