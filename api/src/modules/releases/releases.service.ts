import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Release } from '../../entities/release.entity';
import { ReleaseContributor } from '../../entities/release-contributor.entity';
import { ReleaseGenre } from '../../entities/release-genre.entity';
import { ReleaseLabel } from '../../entities/release-label.entity';
import { Genre } from '../../entities/genre.entity';
import { TrackStatus } from '../../entities/track.entity';
import { CreateReleaseDto } from './dto/create-release.dto';
import { UUID } from '../../types/common.types';
import {
  generateCatalogNumber,
  isValidGRid,
  isValidIso3166Alpha2,
  isValidIso639Language,
  isValidUpc,
  sortContributorsForDisplay,
} from '../../helpers/releases.helper';
import { releaseStoreHasDealCoverage } from '../../helpers/deals.helper';
import { CloudinaryImageUploaderService } from '../uploads/cloudinary-image-uploader.service';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { ROLES } from '../../constants/auth.constant';
import {
  ReleaseGenreType,
  ReleaseParentalAdvisory,
  ReleaseStatus,
  ReleaseType,
  RELEASE_TYPE_TRACK_LIMITS,
} from '../../constants/release.constants';
import { ReleaseLabelType } from '../../constants/release-label.constants';
import { ContributorRole } from '../../constants/contributor.constants';
import { UpdateReleaseOverviewDto } from './dto/update-release-overview.dto';
import { UpdateReleaseTerritoriesDto } from './dto/update-release-territories.dto';
import { UpsertReleaseGenreDto } from './dto/upsert-release-genre.dto';
import { Deal } from '../../entities/deal.entity';
import { TrackRightsController } from '../../entities/track-rights-controller.entity';
import { RightType } from '../../constants/ddex.constants';
import { BinaryLike, createHash } from 'crypto';

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
    @InjectRepository(ReleaseLabel)
    private readonly releaseLabelRepository: Repository<ReleaseLabel>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>,
    @InjectRepository(TrackRightsController)
    private readonly trackRightsControllerRepository: Repository<TrackRightsController>,
    private readonly cloudinaryImageUploaderService: CloudinaryImageUploaderService,
  ) { }

  async createRelease(dto: CreateReleaseDto, userId: UUID): Promise<Release> {
    const release = this.releaseRepository.create({
      title: dto.title,
      type: dto.type,
      createdById: userId,
      catalogNumber: generateCatalogNumber(),
      upc: generateCatalogNumber(6, 'UPC'),
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
    release.metadataLanguage = dto.metadataLanguage?.trim() || undefined;
    release.grid = dto.grid?.trim() || undefined;
    release.description = dto.description?.trim() || undefined;
    if (dto.keywords !== undefined) {
      release.keywords = dto.keywords.map((k) => k.trim()).filter(Boolean);
    }
    release.marketingComment = dto.marketingComment?.trim() || undefined;
    if (dto.grid !== undefined) {
      const trimmed = dto.grid?.trim();
      release.grid = trimmed || undefined;
      if (release.grid && !isValidGRid(release.grid)) {
        throw new BadRequestException(
          'GRid format is invalid (must be 18 alphanumeric characters)',
        );
      }
    }
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
    release.coverArtFileSizeBytes = uploadedCoverArt.bytes;
    const coverBytes = (file?.buffer ?? Buffer.alloc(0)) as BinaryLike;
    release.coverArtChecksumSha256 = createHash('sha256')
      .update(coverBytes)
      .digest('hex');

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

  private static readonly WRITING_ROLES = [
    ContributorRole.SONGWRITER,
    ContributorRole.COMPOSER,
    ContributorRole.LYRICIST,
  ];

  private async validateReleaseContent(
    id: UUID,
    user: AuthUser,
  ): Promise<{ release: Release; errors: string[] }> {
    await this.getAuthorizedRelease(id, user);

    const release = await this.releaseRepository.findOne({
      where: { id },
      relations: {
        tracks: { audioFiles: true, trackContributors: { contributor: true } },
        genres: { genre: true },
        releaseStores: { store: true },
        releaseLabels: { label: true },
      },
    });

    if (!release) {
      throw new NotFoundException('Release not found');
    }

    const errors: string[] = [];

    // --- Basic metadata ---
    if (!release.title) {
      errors.push('Title is required');
    }

    if (!release.type) {
      errors.push('Release type is required');
    }

    if (!release.primaryLanguage) {
      errors.push('Primary language is required');
    } else if (!isValidIso639Language(release.primaryLanguage)) {
      errors.push('Primary language must be a valid ISO 639-1 language code');
    }

    if (!release.metadataLanguage) {
      errors.push('Metadata language is required');
    } else if (!isValidIso639Language(release.metadataLanguage)) {
      errors.push('Metadata language must be a valid ISO 639-1 language code');
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

    // --- Cover art ---
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

    if (release.coverArtUrl) {
      const coverArtLower = release.coverArtUrl.toLowerCase();
      const hasValidFormat =
        coverArtLower.includes('.jpg') ||
        coverArtLower.includes('.jpeg') ||
        coverArtLower.includes('.png');
      if (!hasValidFormat) {
        errors.push('Cover art must be in JPEG or PNG format');
      }
    }

    // --- Dates ---
    if (!release.originalReleaseDate) {
      errors.push('Original release date is required');
    }

    if (!release.digitalReleaseDate) {
      errors.push('Digital release date is required');
    }

    if (release.digitalReleaseDate) {
      const digitalDate = new Date(release.digitalReleaseDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (digitalDate <= today) {
        errors.push('Digital release date must be in the future');
      }
    }

    if (release.preorderDate && release.digitalReleaseDate) {
      const preorderDate = new Date(release.preorderDate);
      const digitalDate = new Date(release.digitalReleaseDate);

      if (preorderDate >= digitalDate) {
        errors.push('Preorder date must be before the digital release date');
      }
    }

    if (release.originalReleaseDate && release.digitalReleaseDate) {
      const originalDate = new Date(release.originalReleaseDate);
      const digitalDate = new Date(release.digitalReleaseDate);

      if (originalDate > digitalDate) {
        errors.push('Original release date must not be after the digital release date');
      }
    }

    if (!release.productionYear) {
      errors.push('Production year is required');
    }

    // --- Territories & Stores ---
    if (release.territories && release.territories.length > 0) {
      for (const territory of release.territories) {
        if (!isValidIso3166Alpha2(territory)) {
          errors.push(`Invalid territory code: ${territory}`);
        }
      }
    }

    if (!release.releaseStores || release.releaseStores.length === 0) {
      errors.push('At least one store is required');
    } else {
      for (const rs of release.releaseStores) {
        const storeName = rs.store?.name ?? 'Unknown store';
        if (!rs.store?.ddexPartyId?.trim()) {
          errors.push(
            `Store "${storeName}" is missing a DDEX Party ID (required for delivery)`,
          );
        }
      }
    }

    if (release.grid && !isValidGRid(release.grid)) {
      errors.push('GRid format is invalid (must be 18 alphanumeric characters)');
    }

    if (!release.coverArtChecksumSha256) {
      errors.push('Cover art checksum is required');
    }

    if (release.coverArtUrl && release.coverArtFileSizeBytes == null) {
      errors.push('Cover art file size is required');
    }

    // --- Tracks ---
    if (!release.tracks || release.tracks.length === 0) {
      errors.push('At least one track is required');
    } else {
      // Track count validation per release type
      if (release.type) {
        const limits = RELEASE_TYPE_TRACK_LIMITS[release.type];
        if (limits) {
          const trackCount = release.tracks.length;
          if (trackCount < limits.min) {
            errors.push(
              `A ${release.type.toLowerCase()} must have at least ${limits.min} track(s), but has ${trackCount}`,
            );
          }
          if (trackCount > limits.max) {
            errors.push(
              `A ${release.type.toLowerCase()} must have at most ${limits.max} track(s), but has ${trackCount}`,
            );
          }
        }
      }

      for (const track of release.tracks) {
        if (track.status !== TrackStatus.VALIDATED) {
          errors.push(`Track "${track.title}" is not validated`);
        }

        // Songwriter/Composer/Lyricist required per track
        const trackContributors = track.trackContributors || [];
        const hasWritingCredit = trackContributors.some((tc) =>
          ReleaseService.WRITING_ROLES.includes(tc.role),
        );
        if (!hasWritingCredit) {
          errors.push(
            `Track "${track.title}" must have at least one songwriter, composer, or lyricist`,
          );
        }

        const hasMakingAvailableRight = await this.trackRightsControllerRepository.exist({
          where: {
            trackId: track.id,
            rightType: RightType.MAKING_AVAILABLE_RIGHT,
          },
        });

        if (!hasMakingAvailableRight) {
          errors.push(
            `Track "${track.title}" must have at least one rights controller with MAKING_AVAILABLE_RIGHT`,
          );
        }
      }

      // Parental advisory auto-derivation
      const hasExplicitTrack = release.tracks.some(
        (track) => track.parentalAdvisory === ReleaseParentalAdvisory.EXPLICIT,
      );
      if (
        hasExplicitTrack &&
        release.parentalAdvisory !== ReleaseParentalAdvisory.EXPLICIT
      ) {
        errors.push(
          'Release must be marked as Explicit because it contains explicit tracks',
        );
      }
    }

    // --- Contributors ---
    const primaryArtist = await this.releaseContributorRepository.findOne({
      where: { releaseId: id, role: ContributorRole.PRIMARY_ARTIST },
    });

    if (!primaryArtist) {
      errors.push('At least one primary artist contributor is required');
    }

    // --- Genres ---
    const hasPrimaryGenre = (release.genres || []).some(
      (releaseGenre) => releaseGenre.type === ReleaseGenreType.PRIMARY,
    );

    if (!hasPrimaryGenre) {
      errors.push('A primary genre is required');
    }

    const deals = await this.dealRepository.find({
      where: { releaseId: id, isActive: true },
    });

    if (deals.length === 0) {
      errors.push('At least one active deal is required');
    } else {
      for (const deal of deals) {
        const allTerritories = [...(deal.territories || []), ...(deal.excludedTerritories || [])];
        for (const territory of allTerritories) {
          if (!isValidIso3166Alpha2(territory)) {
            errors.push(`Invalid deal territory code: ${territory}`);
          }
        }
      }
      if (release.releaseStores?.length) {
        for (const rs of release.releaseStores) {
          if (!releaseStoreHasDealCoverage(rs.storeId, deals)) {
            const storeName = rs.store?.name ?? rs.storeId;
            errors.push(
              `No active deal covers store "${storeName}" (add a global deal or a deal for this store)`,
            );
          }
        }
      }
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

  /**
   * Derives a display artist name from release contributors.
   * Format: "Primary1, Primary2 feat. Featured1, Featured2"
   * Not stored on entity — computed on demand to maintain normalization.
   */
  async computeDisplayArtistName(releaseId: UUID): Promise<string> {
    const contributors = sortContributorsForDisplay(
      await this.releaseContributorRepository.find({
        where: { releaseId },
        relations: ['contributor'],
      }),
    );

    const primaryNames = contributors
      .filter((rc) => rc.role === ContributorRole.PRIMARY_ARTIST)
      .map((rc) => rc.contributor?.displayName || rc.contributor?.name || '')
      .filter(Boolean);

    const featuredNames = contributors
      .filter((rc) => rc.role === ContributorRole.FEATURED_ARTIST)
      .map((rc) => rc.contributor?.displayName || rc.contributor?.name || '')
      .filter(Boolean);

    let displayName = primaryNames.join(', ');

    if (featuredNames.length > 0) {
      displayName += ` feat. ${featuredNames.join(', ')}`;
    }

    return displayName;
  }
}
