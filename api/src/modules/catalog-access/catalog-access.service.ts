import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { PERMISSIONS } from '../../constants/permission.constants';
import { Label } from '../../entities/label.entity';
import { Lyrics } from '../../entities/lyrics.entity';
import { Release } from '../../entities/release.entity';
import { ReleaseContributor } from '../../entities/release-contributor.entity';
import { ReleaseNavigationFlow } from '../../entities/release-navigation-flow.entity';
import { Track } from '../../entities/track.entity';
import { TrackContributor } from '../../entities/track-contributor.entity';
import { UUID } from '../../types/common.types';

@Injectable()
export class CatalogAccessService {
  constructor(
    @InjectRepository(Release)
    private readonly releaseRepository: Repository<Release>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @InjectRepository(Lyrics)
    private readonly lyricsRepository: Repository<Lyrics>,
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
    @InjectRepository(ReleaseContributor)
    private readonly releaseContributorRepository: Repository<ReleaseContributor>,
    @InjectRepository(ReleaseNavigationFlow)
    private readonly releaseNavigationFlowRepository: Repository<ReleaseNavigationFlow>,
    @InjectRepository(TrackContributor)
    private readonly trackContributorRepository: Repository<TrackContributor>,
  ) {}

  canManageAllReleases(user?: AuthUser): boolean {
    return Boolean(
      user?.permissions?.includes(PERMISSIONS.MANAGE_ALL_RELEASES),
    );
  }

  canReviewReleases(user?: AuthUser): boolean {
    return Boolean(user?.permissions?.includes(PERMISSIONS.REVIEW_RELEASE));
  }

  async assertCanReadRelease(releaseId: UUID, user: AuthUser): Promise<Release> {
    const release = await this.getRelease(releaseId);
    if (
      release.createdById !== user.id &&
      !this.canManageAllReleases(user) &&
      !this.canReviewReleases(user)
    ) {
      throw new ForbiddenException('You do not have access to this release');
    }
    return release;
  }

  async assertCanWriteRelease(releaseId: UUID, user: AuthUser): Promise<Release> {
    const release = await this.getRelease(releaseId);
    if (release.createdById !== user.id && !this.canManageAllReleases(user)) {
      throw new ForbiddenException('You cannot modify this release');
    }
    return release;
  }

  async assertCanReadTrack(trackId: UUID, user: AuthUser): Promise<Track> {
    const track = await this.getTrack(trackId);
    await this.assertCanReadRelease(track.releaseId, user);
    return track;
  }

  async assertCanWriteTrack(trackId: UUID, user: AuthUser): Promise<Track> {
    const track = await this.getTrack(trackId);
    await this.assertCanWriteRelease(track.releaseId, user);
    return track;
  }

  async assertCanReadLyrics(lyricsId: UUID, user: AuthUser): Promise<Lyrics> {
    const lyrics = await this.getLyrics(lyricsId);
    await this.assertCanReadTrack(lyrics.trackId, user);
    return lyrics;
  }

  async assertCanWriteLyrics(lyricsId: UUID, user: AuthUser): Promise<Lyrics> {
    const lyrics = await this.getLyrics(lyricsId);
    await this.assertCanWriteTrack(lyrics.trackId, user);
    return lyrics;
  }

  async assertCanWriteLabel(labelId: UUID, user: AuthUser): Promise<Label> {
    const label = await this.labelRepository.findOne({ where: { id: labelId } });
    if (!label) {
      throw new NotFoundException('Label not found');
    }
    if (label.createdById !== user.id && !this.canManageAllReleases(user)) {
      throw new ForbiddenException('You cannot modify this label');
    }
    return label;
  }

  async assertCanWriteReleaseContributor(id: UUID, user: AuthUser): Promise<void> {
    const item = await this.releaseContributorRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Release contributor not found');
    await this.assertCanWriteRelease(item.releaseId, user);
  }

  async assertCanWriteReleaseNavigationFlow(id: UUID, user: AuthUser): Promise<void> {
    const flow = await this.releaseNavigationFlowRepository.findOne({ where: { id } });
    if (!flow) throw new NotFoundException('Release navigation flow not found');
    await this.assertCanWriteRelease(flow.releaseId, user);
  }

  async assertCanWriteTrackContributor(id: UUID, user: AuthUser): Promise<void> {
    const item = await this.trackContributorRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Track contributor not found');
    await this.assertCanWriteTrack(item.trackId, user);
  }

  private async getRelease(releaseId: UUID): Promise<Release> {
    const release = await this.releaseRepository.findOne({
      where: { id: releaseId },
    });
    if (!release) {
      throw new NotFoundException('Release not found');
    }
    return release;
  }

  private async getTrack(trackId: UUID): Promise<Track> {
    const track = await this.trackRepository.findOne({ where: { id: trackId } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  private async getLyrics(lyricsId: UUID): Promise<Lyrics> {
    const lyrics = await this.lyricsRepository.findOne({ where: { id: lyricsId } });
    if (!lyrics) {
      throw new NotFoundException('Lyrics not found');
    }
    return lyrics;
  }
}
