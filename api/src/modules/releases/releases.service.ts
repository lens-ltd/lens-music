import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Release } from '../../entities/release.entity';
import { ReleaseContributor } from '../../entities/release-contributor.entity';
import { ReleaseGenre } from '../../entities/release-genre.entity';
import { Genre } from '../../entities/genre.entity';
import { TrackStatus } from '../../entities/track.entity';
import { CreateReleaseDto } from './dto/create-release.dto';
import { UUID } from '../../types/common.types';
import { generateCatalogNumber, isValidUpc } from '../../helpers/releases.helper';
import { CloudinaryImageUploaderService } from '../uploads/cloudinary-image-uploader.service';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { ROLES } from '../../constants/auth.constant';
import { ReleaseGenreType, ReleaseStatus } from '../../constants/release.constants';
import { ContributorRole } from '../../constants/contributor.constants';
import { UpdateReleaseOverviewDto } from './dto/update-release-overview.dto';
import { UpdateReleaseTerritoriesDto } from './dto/update-release-territories.dto';
import { UpsertReleaseGenreDto } from './dto/upsert-release-genre.dto';

@Injectable()
export class ReleaseService {
  private static readonly MIN_COVER_ART_DIMENSION = 3000;

  constructor(
    @InjectRepository(Release)
    private readonly releaseRepository: Repository<Release>,
    @InjectRepository(ReleaseContributor)
    private readonly releaseContributorRepository: Repository<ReleaseContributor>,
    @InjectRepository(ReleaseGenre)
    private readonly releaseGenreRepository: Repository<ReleaseGenre>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
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
    release.upc = dto.upc?.trim() || undefined;
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
    this.resetValidatedReleaseToDraft(release);

    return this.releaseRepository.save(release);
  }


  async updateTerritories(
    id: UUID,
    dto: UpdateReleaseTerritoriesDto,
    user: AuthUser,
  ): Promise<Release> {
    const release = await this.getAuthorizedRelease(id, user);

    release.territories = dto.territories;
    this.resetValidatedReleaseToDraft(release);

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
    release.coverArtWidth = uploadedCoverArt.width;
    release.coverArtHeight = uploadedCoverArt.height;

    if (uploadedCoverArt.colorMode && uploadedCoverArt.colorMode.toLowerCase() !== 'rgb') {
      throw new BadRequestException('Cover art must use RGB color mode');
    }
    this.resetValidatedReleaseToDraft(release);

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
  ): Promise<{ valid: boolean; errors: string[]; release?: Release }> {
    const { release, errors } = await this.validateReleaseContent(id, user);

    if (errors.length === 0) {
      release.status = ReleaseStatus.VALIDATED;
      const savedRelease = await this.releaseRepository.save(release);
      return { valid: true, errors, release: savedRelease };
    }

    return { valid: false, errors };
  }

  async submitRelease(
    id: UUID,
    user: AuthUser,
  ): Promise<{ valid: boolean; errors: string[]; release?: Release }> {
    const { release, errors } = await this.validateReleaseContent(id, user);

    if (errors.length === 0) {
      release.status = ReleaseStatus.REVIEW;
      const savedRelease = await this.releaseRepository.save(release);
      return { valid: true, errors, release: savedRelease };
    }

    return { valid: false, errors };
  }


  async upsertReleaseGenre(
    releaseId: UUID,
    dto: UpsertReleaseGenreDto,
    user: AuthUser,
  ): Promise<ReleaseGenre> {
    await this.getAuthorizedRelease(releaseId, user);

    const genre = await this.genreRepository.findOne({ where: { id: dto.genreId } });
    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    const existingByType = await this.releaseGenreRepository.findOne({
      where: { releaseId, type: dto.type },
    });

    if (existingByType) {
      existingByType.genreId = dto.genreId;
      existingByType.createdById = existingByType.createdById || user.id;
      const updated = await this.releaseGenreRepository.save(existingByType);
      await this.resetValidatedReleaseToDraftById(releaseId);
      return this.releaseGenreRepository.findOneOrFail({
        where: { id: updated.id },
        relations: { genre: true },
      });
    }

    const releaseGenre = this.releaseGenreRepository.create({
      releaseId,
      genreId: dto.genreId,
      type: dto.type,
      createdById: user.id,
    });

    const saved = await this.releaseGenreRepository.save(releaseGenre);
    await this.resetValidatedReleaseToDraftById(releaseId);

    return this.releaseGenreRepository.findOneOrFail({
      where: { id: saved.id },
      relations: { genre: true },
    });
  }

  async getReleaseGenres(releaseId: UUID, user: AuthUser): Promise<ReleaseGenre[]> {
    await this.getAuthorizedRelease(releaseId, user);
    return this.releaseGenreRepository.find({
      where: { releaseId },
      relations: { genre: true },
      order: { createdAt: 'ASC' },
    });
  }

  async deleteReleaseGenreByType(
    releaseId: UUID,
    type: ReleaseGenreType,
    user: AuthUser,
  ): Promise<void> {
    await this.getAuthorizedRelease(releaseId, user);

    const existing = await this.releaseGenreRepository.findOne({
      where: { releaseId, type },
    });

    if (!existing) {
      throw new NotFoundException('Release genre not found');
    }

    await this.releaseGenreRepository.delete(existing.id);
    await this.resetValidatedReleaseToDraftById(releaseId);
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

  private async validateReleaseContent(
    id: UUID,
    user: AuthUser,
  ): Promise<{ release: Release; errors: string[] }> {
    await this.getAuthorizedRelease(id, user);

    const release = await this.releaseRepository.findOne({
      where: { id },
      relations: {
        tracks: { audioFiles: true, trackContributors: true },
        genres: { genre: true },
        releaseStores: true,
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

    if (!release.upc) {
      errors.push('UPC is required');
    } else if (!isValidUpc(release.upc)) {
      errors.push('UPC format is invalid');
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

    if (!release.coverArtWidth || !release.coverArtHeight) {
      errors.push('Cover art dimensions are required');
    } else {
      if (
        release.coverArtWidth < ReleaseService.MIN_COVER_ART_DIMENSION
        || release.coverArtHeight < ReleaseService.MIN_COVER_ART_DIMENSION
      ) {
        errors.push('Cover art must be at least 3000x3000 pixels');
      }

      if (release.coverArtWidth !== release.coverArtHeight) {
        errors.push('Cover art must have a square aspect ratio');
      }
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

    if (!release.releaseStores || release.releaseStores.length === 0) {
      errors.push('At least one store is required');
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

    const hasPrimaryGenre = (release.genres || []).some(
      (releaseGenre) => releaseGenre.type === ReleaseGenreType.PRIMARY,
    );

    if (!hasPrimaryGenre) {
      errors.push('A primary genre is required');
    }

    return { release, errors };
  }

  private resetValidatedReleaseToDraft(release: Release): void {
    if (release.status === ReleaseStatus.VALIDATED) {
      release.status = ReleaseStatus.DRAFT;
    }
  }

  private async resetValidatedReleaseToDraftById(releaseId: UUID): Promise<void> {
    const release = await this.releaseRepository.findOne({ where: { id: releaseId } });

    if (release) {
      this.resetValidatedReleaseToDraft(release);
      if (release.status === ReleaseStatus.DRAFT) {
        await this.releaseRepository.save(release);
      }
    }
  }
}
