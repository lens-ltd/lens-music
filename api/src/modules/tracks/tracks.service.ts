import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from '../../entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UUID } from '../../types/common.types';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

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
}
