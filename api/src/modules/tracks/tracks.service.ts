import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from '../../entities/track.entity';
import { AudioFile, AudioFileType } from '../../entities/audio-file.entity';
import { TrackContributor } from '../../entities/track-contributor.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { RegisterAudioDto } from './dto/register-audio.dto';
import { UUID } from '../../types/common.types';
import { CloudinaryAudioUploaderService, UploadSignatureResult } from '../uploads/cloudinary-audio-uploader.service';
import { TrackStatus } from '../../entities/track.entity';
import { isValidIsrc, normalizeIsrc } from '../../helpers/tracks.helper';
import { ContributorRole } from '../../constants/contributor.constants';

@Injectable()
export class TrackService {
  private readonly logger = new Logger(TrackService.name);

  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @InjectRepository(AudioFile)
    private readonly audioFileRepository: Repository<AudioFile>,
    @InjectRepository(TrackContributor)
    private readonly trackContributorRepository: Repository<TrackContributor>,
    private readonly cloudinaryAudioUploaderService: CloudinaryAudioUploaderService,
  ) {}

  private normalizeTrackStringFields<T extends Partial<Track>>(track: T): T {
    if (typeof track.primaryLanguage === 'string') {
      track.primaryLanguage = track.primaryLanguage.trim() as T['primaryLanguage'];
    }

    if (typeof track.isrc === 'string') {
      track.isrc = normalizeIsrc(track.isrc) as T['isrc'];
    }

    return track;
  }

  private async parseAudioBuffer(
    file: Express.Multer.File,
  ): Promise<{
    format: {
      sampleRate?: number;
      bitsPerSample?: number;
      numberOfChannels?: number;
      duration?: number;
    };
  } | null> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const musicMetadata = require('music-metadata') as {
        parseBuffer: (
          buffer: Buffer,
          mimeType?: string,
          options?: { duration?: boolean },
        ) => Promise<{
          format: {
            sampleRate?: number;
            bitsPerSample?: number;
            numberOfChannels?: number;
            duration?: number;
          };
        }>;
      };

      return musicMetadata.parseBuffer(file.buffer, file.mimetype, {
        duration: true,
      });
    } catch (error) {
      this.logger.warn(
        `music-metadata parser unavailable for ${file.originalname}: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  }

  private async extractAudioMetadata(
    file: Express.Multer.File,
  ): Promise<
    Partial<Pick<AudioFile, 'sampleRate' | 'bitDepth' | 'channels' | 'durationMs'>>
  > {
    try {
      const metadata = await this.parseAudioBuffer(file);
      if (!metadata) {
        return {};
      }
      const format = metadata.format;

      return {
        sampleRate:
          typeof format.sampleRate === 'number' && Number.isFinite(format.sampleRate)
            ? Math.round(format.sampleRate)
            : undefined,
        bitDepth:
          typeof format.bitsPerSample === 'number' && Number.isFinite(format.bitsPerSample)
            ? Math.round(format.bitsPerSample)
            : undefined,
        channels:
          typeof format.numberOfChannels === 'number' && Number.isFinite(format.numberOfChannels)
            ? Math.round(format.numberOfChannels)
            : undefined,
        durationMs:
          typeof format.duration === 'number' && Number.isFinite(format.duration)
            ? Math.round(format.duration * 1000)
            : undefined,
      };
    } catch (error) {
      this.logger.warn(
        `Failed to extract audio metadata from ${file.originalname}: ${error instanceof Error ? error.message : String(error)}`,
      );
      return {};
    }
  }

  async createTrack(dto: CreateTrackDto, userId: UUID): Promise<Track> {
    const discNumber = 1;
    const raw = await this.trackRepository
      .createQueryBuilder('track')
      .select('MAX(track.track_number)', 'maxTrackNumber')
      .where('track.release_id = :releaseId', { releaseId: dto.releaseId })
      .andWhere('track.disc_number = :discNumber', { discNumber })
      .getRawOne<{ maxTrackNumber: string | null }>();

    const nextTrackNumber = Number(raw?.maxTrackNumber || 0) + 1;

    const track = this.trackRepository.create({
      releaseId: dto.releaseId,
      title: dto.title,
      titleVersion: dto.titleVersion,
      discNumber,
      trackNumber: nextTrackNumber,
      durationMs: 30000,
      createdById: userId,
    });

    return this.trackRepository.save(track);
  }

  async updateTrack(id: UUID, dto: UpdateTrackDto): Promise<Track> {
    const track = await this.trackRepository.findOne({ where: { id } });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    const normalizedDto = this.normalizeTrackStringFields({ ...dto });

    const hasChanges = Object.entries(normalizedDto).some(([key, value]) => {
      return track[key as keyof Track] !== value;
    });

    if (!hasChanges) {
      return this.normalizeTrackStringFields(track);
    }

    Object.assign(track, normalizedDto);
    track.status = TrackStatus.DRAFT;

    return this.normalizeTrackStringFields(
      await this.trackRepository.save(track),
    );
  }

  async validateTrack(id: UUID): Promise<{ valid: boolean; errors: string[] }> {
    const track = await this.trackRepository.findOne({
      where: { id },
      relations: ['audioFiles', 'trackContributors'],
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    const errors: string[] = [];

    if (!track.title) {
      errors.push('Title is required');
    }

    if (!track.primaryLanguage) {
      errors.push('Primary language is required');
    }

    const normalizedIsrc = typeof track.isrc === 'string' ? normalizeIsrc(track.isrc) : undefined;

    if (!normalizedIsrc) {
      errors.push('ISRC is required');
    } else if (!isValidIsrc(normalizedIsrc)) {
      errors.push('ISRC format is invalid');
    } else if (track.isrc !== normalizedIsrc) {
      track.isrc = normalizedIsrc;
    }

    if (!track.cLineYear) {
      errors.push('C-line year is required');
    }

    if (!track.cLineOwner) {
      errors.push('C-line owner is required');
    }

    if (!track.pLineYear) {
      errors.push('P-line year is required');
    }

    if (!track.pLineOwner) {
      errors.push('P-line owner is required');
    }

    if (!track.audioFiles || track.audioFiles.length === 0) {
      errors.push('At least one audio file is required');
    } else {
      const primaryAudioFile =
        track.audioFiles.find((audioFile) => audioFile.isPrimary) ?? track.audioFiles[0];

      if (!primaryAudioFile.sampleRate) {
        errors.push('Primary audio file sample rate is required');
      } else if (primaryAudioFile.sampleRate < 44100) {
        errors.push('Primary audio file sample rate must be at least 44100 Hz');
      }

      if (!primaryAudioFile.bitDepth) {
        errors.push('Primary audio file bit depth is required');
      } else if (primaryAudioFile.bitDepth < 16) {
        errors.push('Primary audio file bit depth must be at least 16-bit');
      }
    }

    if (!track.trackContributors || track.trackContributors.length === 0) {
      errors.push('At least one contributor is required');
    } else {
      const writingRoles = [
        ContributorRole.SONGWRITER,
        ContributorRole.COMPOSER,
        ContributorRole.LYRICIST,
      ];
      const hasWritingCredit = track.trackContributors.some((tc) =>
        writingRoles.includes(tc.role),
      );
      if (!hasWritingCredit) {
        errors.push('At least one songwriter, composer, or lyricist is required');
      }
    }

    // Primary audio must be lossless (WAV or FLAC)
    if (track.audioFiles && track.audioFiles.length > 0) {
      const primaryAudioFile =
        track.audioFiles.find((af) => af.isPrimary) ?? track.audioFiles[0];
      const losslessTypes = [AudioFileType.WAV, AudioFileType.FLAC, AudioFileType.ORIGINAL];
      if (!losslessTypes.includes(primaryAudioFile.fileType)) {
        errors.push('Primary audio file must be in a lossless format (WAV or FLAC)');
      }
    }

    if (errors.length === 0) {
      track.status = TrackStatus.VALIDATED;
      await this.trackRepository.save(track);
    }

    return { valid: errors.length === 0, errors };
  }

  async uploadAudio(
    trackId: UUID,
    file: Express.Multer.File,
    userId: UUID,
  ): Promise<AudioFile> {
    const track = await this.trackRepository.findOne({
      where: { id: trackId },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    const previousAudioFiles = await this.audioFileRepository.find({
      where: { trackId },
    });

    const uploadResult = await this.cloudinaryAudioUploaderService.uploadAudio({
      file,
      folder: `tracks/${trackId}/audio`,
    });
    const extractedMetadata = await this.extractAudioMetadata(file);

    for (const prev of previousAudioFiles) {
      if (prev.cloudinaryPublicId) {
        await this.cloudinaryAudioUploaderService.destroyAudio(prev.cloudinaryPublicId);
      }
    }

    await this.audioFileRepository.delete({ trackId });

    const audioFile = this.audioFileRepository.create({
      trackId,
      fileType: AudioFileType.ORIGINAL,
      storagePath: uploadResult.secureUrl,
      cloudinaryPublicId: uploadResult.publicId,
      fileSizeBytes: uploadResult.bytes,
      durationMs: extractedMetadata.durationMs ?? uploadResult.durationMs,
      sampleRate: extractedMetadata.sampleRate,
      bitDepth: extractedMetadata.bitDepth,
      channels: extractedMetadata.channels ?? 2,
      isPrimary: true,
      uploadedById: userId,
    });

    // Update track duration if we got it from the upload
    const nextTrackUpdate: Partial<Track> = {
      status: TrackStatus.DRAFT,
    };

    const canonicalDurationMs = extractedMetadata.durationMs ?? uploadResult.durationMs;

    if (canonicalDurationMs) {
      nextTrackUpdate.durationMs = canonicalDurationMs;
    }

    await this.trackRepository.update(trackId, nextTrackUpdate);

    return this.audioFileRepository.save(audioFile);
  }

  async getUploadSignature(trackId: UUID): Promise<UploadSignatureResult> {
    const track = await this.trackRepository.findOne({
      where: { id: trackId },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return this.cloudinaryAudioUploaderService.generateUploadSignature(
      `tracks/${trackId}/audio`,
    );
  }

  async registerUploadedAudio(
    trackId: UUID,
    dto: RegisterAudioDto,
    userId: UUID,
  ): Promise<AudioFile> {
    const track = await this.trackRepository.findOne({
      where: { id: trackId },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    const previousAudioFiles = await this.audioFileRepository.find({
      where: { trackId },
    });

    for (const prev of previousAudioFiles) {
      if (prev.cloudinaryPublicId) {
        await this.cloudinaryAudioUploaderService.destroyAudio(prev.cloudinaryPublicId);
      }
    }

    await this.audioFileRepository.delete({ trackId });

    const audioFile = this.audioFileRepository.create({
      trackId,
      fileType: AudioFileType.ORIGINAL,
      storagePath: dto.secureUrl,
      cloudinaryPublicId: dto.publicId,
      fileSizeBytes: dto.bytes,
      durationMs: dto.durationMs,
      sampleRate: dto.sampleRate,
      bitDepth: dto.bitDepth,
      channels: dto.channels ?? 2,
      isPrimary: true,
      uploadedById: userId,
    });

    const nextTrackUpdate: Partial<Track> = {
      status: TrackStatus.DRAFT,
    };

    if (dto.durationMs) {
      nextTrackUpdate.durationMs = dto.durationMs;
    }

    await this.trackRepository.update(trackId, nextTrackUpdate);

    return this.audioFileRepository.save(audioFile);
  }

  async deleteAudio(trackId: UUID, audioFileId: UUID): Promise<void> {
    const audioFile = await this.audioFileRepository.findOne({
      where: { id: audioFileId, trackId },
    });

    if (!audioFile) {
      throw new NotFoundException('Audio file not found');
    }

    const deletedPrimary = audioFile.isPrimary;

    if (audioFile.cloudinaryPublicId) {
      await this.cloudinaryAudioUploaderService.destroyAudio(
        audioFile.cloudinaryPublicId,
      );
    }

    await this.audioFileRepository.delete(audioFileId);

    if (deletedPrimary) {
      const latestAudioFile = await this.audioFileRepository.findOne({
        where: { trackId },
        order: { uploadedAt: 'DESC' },
      });

      if (latestAudioFile) {
        latestAudioFile.isPrimary = true;
        await this.audioFileRepository.save(latestAudioFile);
      }
    }

    await this.trackRepository.update(trackId, {
      status: TrackStatus.DRAFT,
    });
  }

  /**
   * Derives a display artist name from track contributors.
   * Format: "Primary1, Primary2 feat. Featured1, Featured2"
   * Not stored on entity — computed on demand to maintain normalization.
   */
  async computeTrackDisplayArtistName(trackId: UUID): Promise<string> {
    const contributors = await this.trackContributorRepository.find({
      where: { trackId },
      relations: ['contributor'],
      order: { createdAt: 'ASC' },
    });

    const primaryNames = contributors
      .filter((tc) => tc.role === ContributorRole.PRIMARY_ARTIST)
      .map((tc) => tc.contributor?.displayName || tc.contributor?.name || '')
      .filter(Boolean);

    const featuredNames = contributors
      .filter((tc) => tc.role === ContributorRole.FEATURED_ARTIST)
      .map((tc) => tc.contributor?.displayName || tc.contributor?.name || '')
      .filter(Boolean);

    let displayName = primaryNames.join(', ');

    if (featuredNames.length > 0) {
      displayName += ` feat. ${featuredNames.join(', ')}`;
    }

    return displayName;
  }
}
