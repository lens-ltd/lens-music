import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository, In } from 'typeorm';
import { create } from 'xmlbuilder2';
import { v4 as uuidv4 } from 'uuid';

import { Release } from '../../entities/release.entity';
import { Track } from '../../entities/track.entity';
import { ReleaseContributor } from '../../entities/release-contributor.entity';
import { TrackContributor } from '../../entities/track-contributor.entity';
import { ReleaseLabel } from '../../entities/release-label.entity';
import { Deal } from '../../entities/deal.entity';
import { Store } from '../../entities/store.entity';
import { ReleaseStore } from '../../entities/release-store.entity';
import { TrackRightsController } from '../../entities/track-rights-controller.entity';
import { ReleaseGenre } from '../../entities/release-genre.entity';
import { ReleaseTerritoryDetail } from '../../entities/release-territory-detail.entity';
import { RelatedRelease } from '../../entities/related-release.entity';

import { ReleaseStatus } from '../../constants/release.constants';
import { ReleaseLabelType } from '../../constants/release-label.constants';
import { RELEASE_TYPE_TO_DDEX_VALUE } from '../../constants/ddex-release.constants';

import { ErnContext } from './interfaces/ern-context.interface';
import { ErnReferenceManager } from './helpers/ern-reference-manager';
import { buildMessageHeader } from './builders/message-header.builder';
import { buildPartyList } from './builders/party-list.builder';
import { buildResourceList } from './builders/resource-list.builder';
import { buildReleaseList } from './builders/release-list.builder';
import { buildDealList } from './builders/deal-list.builder';

const ALLOWED_STATUSES: ReleaseStatus[] = [
  ReleaseStatus.VALIDATED,
  ReleaseStatus.REVIEW,
  ReleaseStatus.APPROVED,
  ReleaseStatus.DELIVERED,
  ReleaseStatus.LIVE,
];

const RELEASE_TYPE_TO_PROFILE: Record<string, string> = {
  Album: 'CommonReleaseTypes/14/AudioAlbumMusicOnly',
  EP: 'CommonReleaseTypes/14/AudioAlbumMusicOnly',
  Single: 'CommonReleaseTypes/14/AudioSingle',
  Compilation: 'CommonReleaseTypes/14/AudioAlbumMusicOnly',
};

@Injectable()
export class DdexErnGeneratorService {
  constructor(
    @InjectRepository(Release)
    private readonly releaseRepo: Repository<Release>,
    @InjectRepository(Track)
    private readonly trackRepo: Repository<Track>,
    @InjectRepository(ReleaseContributor)
    private readonly releaseContributorRepo: Repository<ReleaseContributor>,
    @InjectRepository(TrackContributor)
    private readonly trackContributorRepo: Repository<TrackContributor>,
    @InjectRepository(ReleaseLabel)
    private readonly releaseLabelRepo: Repository<ReleaseLabel>,
    @InjectRepository(Deal)
    private readonly dealRepo: Repository<Deal>,
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
    @InjectRepository(ReleaseStore)
    private readonly releaseStoreRepo: Repository<ReleaseStore>,
    @InjectRepository(TrackRightsController)
    private readonly trackRightsControllerRepo: Repository<TrackRightsController>,
    @InjectRepository(ReleaseGenre)
    private readonly releaseGenreRepo: Repository<ReleaseGenre>,
    @InjectRepository(ReleaseTerritoryDetail)
    private readonly territoryDetailRepo: Repository<ReleaseTerritoryDetail>,
    @InjectRepository(RelatedRelease)
    private readonly relatedReleaseRepo: Repository<RelatedRelease>,
    private readonly configService: ConfigService,
  ) {}

  async generateErn(
    releaseId: string,
    storeId: string,
  ): Promise<{ xml: string; messageId: string }> {
    const ctx = await this.buildContext(releaseId, storeId);

    const ddexReleaseType = ctx.release.type
      ? RELEASE_TYPE_TO_DDEX_VALUE[ctx.release.type]
      : 'Album';
    const profileId =
      RELEASE_TYPE_TO_PROFILE[ddexReleaseType] ||
      'CommonReleaseTypes/14/AudioAlbumMusicOnly';

    // Build XML document
    const doc = create({ version: '1.0', encoding: 'UTF-8' });
    const root = doc.ele('ernm:NewReleaseMessage', {
      'xmlns:ernm': 'http://ddex.net/xml/ern/43',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xsi:schemaLocation':
        'http://ddex.net/xml/ern/43 http://ddex.net/xml/ern/43/release-notification.xsd',
      MessageSchemaVersionId: 'ern/43',
      LanguageAndScriptCode: ctx.release.metadataLanguage || 'en',
      ReleaseProfileVersionId: profileId,
      UpdateIndicator: ctx.updateIndicator,
    });

    // Build sections in order — PartyList is built last but inserted
    // in correct position using xmlbuilder2's insertion capabilities
    buildMessageHeader(root, ctx);

    // We need to build ResourceList, ReleaseList, DealList first to accumulate party refs,
    // then build PartyList and insert it before ResourceList.
    // Strategy: build into a temporary structure, then assemble.
    const tempDoc = create();
    const tempRoot = tempDoc.ele('temp');

    buildResourceList(tempRoot, ctx);
    buildReleaseList(tempRoot, ctx);
    buildDealList(tempRoot, ctx);

    // Now build PartyList with all accumulated refs
    buildPartyList(root, ctx);

    // Move ResourceList, ReleaseList, DealList from temp to root
    for (const child of tempRoot.toArray()) {
      root.import(child);
    }

    const xml = doc.end({ prettyPrint: true });

    // Update ReleaseStore with message tracking info
    await this.releaseStoreRepo.update(
      { releaseId, storeId },
      {
        ddexMessageId: ctx.messageId,
        ddexMessageSentAt: new Date(),
      },
    );

    return { xml, messageId: ctx.messageId };
  }

  private async buildContext(
    releaseId: string,
    storeId: string,
  ): Promise<ErnContext> {
    // Load release
    const release = await this.releaseRepo.findOne({ where: { id: releaseId } });
    if (!release) {
      throw new NotFoundException(`Release ${releaseId} not found`);
    }

    if (!ALLOWED_STATUSES.includes(release.status)) {
      throw new BadRequestException(
        `Release status must be one of: ${ALLOWED_STATUSES.join(', ')}. Current: ${release.status}`,
      );
    }

    if (!release.upc) {
      throw new BadRequestException('Release must have a UPC');
    }

    if (!release.coverArtUrl) {
      throw new BadRequestException('Release must have cover art');
    }

    // Load store
    const store = await this.storeRepo.findOne({ where: { id: storeId } });
    if (!store) {
      throw new NotFoundException(`Store ${storeId} not found`);
    }

    if (!store.ddexPartyId) {
      throw new BadRequestException(
        `Store "${store.name}" does not have a DDEX Party ID configured`,
      );
    }

    // Load release-store record
    let releaseStore = await this.releaseStoreRepo.findOne({
      where: { releaseId, storeId },
    });
    if (!releaseStore) {
      releaseStore = this.releaseStoreRepo.create({ releaseId, storeId });
      releaseStore = await this.releaseStoreRepo.save(releaseStore);
    }

    // Load tracks with audio files
    const tracks = await this.trackRepo.find({
      where: { releaseId },
      relations: ['audioFiles'],
      order: { discNumber: 'ASC', trackNumber: 'ASC' },
    });

    if (tracks.length === 0) {
      throw new BadRequestException('Release has no tracks');
    }

    // Validate all tracks have ISRC
    const tracksWithoutIsrc = tracks.filter(t => !t.isrc);
    if (tracksWithoutIsrc.length > 0) {
      throw new BadRequestException(
        `Tracks missing ISRC: ${tracksWithoutIsrc.map(t => t.title).join(', ')}`,
      );
    }

    // Load release contributors with contributor relation
    const releaseContributors = await this.releaseContributorRepo.find({
      where: { releaseId },
      relations: ['contributor'],
      order: { sequenceNumber: 'ASC' },
    });

    // Load track contributors for all tracks
    const trackIds = tracks.map(t => t.id);
    const allTrackContributors = await this.trackContributorRepo.find({
      where: { trackId: In(trackIds) },
      relations: ['contributor'],
      order: { sequenceNumber: 'ASC' },
    });

    const trackContributorsMap = new Map<string, TrackContributor[]>();
    for (const tc of allTrackContributors) {
      const existing = trackContributorsMap.get(tc.trackId) || [];
      existing.push(tc);
      trackContributorsMap.set(tc.trackId, existing);
    }

    // Load release labels with label relation
    const releaseLabels = await this.releaseLabelRepo.find({
      where: { releaseId },
      relations: ['label'],
    });

    // Validate primary label exists
    const primaryLabel = releaseLabels.find(
      rl => rl.type === ReleaseLabelType.PRIMARY,
    );
    if (!primaryLabel?.label) {
      throw new BadRequestException('Release must have a primary label');
    }

    // Load deals (active, matching store or global)
    const deals = await this.dealRepo
      .createQueryBuilder('deal')
      .where('deal.release_id = :releaseId', { releaseId })
      .andWhere('deal.is_active = true')
      .andWhere('(deal.store_id = :storeId OR deal.store_id IS NULL)', { storeId })
      .getMany();

    // Load track rights controllers
    const allRightsControllers = await this.trackRightsControllerRepo.find({
      where: { trackId: In(trackIds) },
      relations: ['contributor', 'label'],
    });

    const trackRightsControllersMap = new Map<string, TrackRightsController[]>();
    for (const trc of allRightsControllers) {
      const existing = trackRightsControllersMap.get(trc.trackId) || [];
      existing.push(trc);
      trackRightsControllersMap.set(trc.trackId, existing);
    }

    // Load genres with genre relation
    const genres = await this.releaseGenreRepo.find({
      where: { releaseId },
      relations: ['genre'],
    });

    // Load territory details
    const territoryDetails = await this.territoryDetailRepo.find({
      where: { releaseId },
    });

    // Load related releases
    const relatedReleases = await this.relatedReleaseRepo.find({
      where: { releaseId },
    });

    // Computed fields
    const senderDpid =
      this.configService.get<string>('DDEX_SENDER_DPID') ||
      primaryLabel.label.ddexPartyId ||
      'UNKNOWN';
    const senderName = primaryLabel.label.name;
    const recipientDpid = store.ddexPartyId!;
    const recipientName = store.name;
    const messageId = `${senderDpid}:${Date.now()}:${uuidv4().slice(0, 8)}`;
    const updateIndicator = releaseStore.ddexMessageId
      ? ('UpdateMessage' as const)
      : ('OriginalMessage' as const);

    return {
      release,
      tracks,
      releaseContributors,
      trackContributorsMap,
      releaseLabels,
      deals,
      store,
      releaseStore,
      trackRightsControllersMap,
      genres,
      territoryDetails,
      relatedReleases,
      senderDpid,
      senderName,
      recipientDpid,
      recipientName,
      messageId,
      updateIndicator,
      refs: new ErnReferenceManager(),
    };
  }
}
