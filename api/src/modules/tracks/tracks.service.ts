import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from '../../entities/track.entity';
import { AudioFile, AudioFileType } from '../../entities/audio-file.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { UUID } from '../../types/common.types';
import { CloudinaryAudioUploaderService } from '../uploads/cloudinary-audio-uploader.service';
import { TrackStatus } from '../../entities/track.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @InjectRepository(AudioFile)
    private readonly audioFileRepository: Repository<AudioFile>,
    private readonly cloudinaryAudioUploaderService: CloudinaryAudioUploaderService,
  ) {}

  private normalizeTrackStringFields<T extends Partial<Track>>(track: T): T {
    if (typeof track.primaryLanguage === 'string') {
      track.primaryLanguage = track.primaryLanguage.trim() as T['primaryLanguage'];
    }

    return track;
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
    }

    if (!track.trackContributors || track.trackContributors.length === 0) {
      errors.push('At least one contributor is required');
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

    const uploadResult = await this.cloudinaryAudioUploaderService.uploadAudio({
      file,
      folder: `tracks/${trackId}/audio`,
    });

    await this.audioFileRepository.update({ trackId }, { isPrimary: false });

    const audioFile = this.audioFileRepository.create({
      trackId,
      fileType: AudioFileType.ORIGINAL,
      storagePath: uploadResult.secureUrl,
      fileSizeBytes: uploadResult.bytes,
      durationMs: uploadResult.durationMs,
      isPrimary: true,
      uploadedById: userId,
    });

    // Update track duration if we got it from the upload
    const nextTrackUpdate: Partial<Track> = {
      status: TrackStatus.DRAFT,
    };

    if (uploadResult.durationMs) {
      nextTrackUpdate.durationMs = uploadResult.durationMs;
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
}
