import { Release } from '../../../entities/release.entity';
import { Track } from '../../../entities/track.entity';
import { ReleaseContributor } from '../../../entities/release-contributor.entity';
import { TrackContributor } from '../../../entities/track-contributor.entity';
import { ReleaseLabel } from '../../../entities/release-label.entity';
import { Deal } from '../../../entities/deal.entity';
import { Store } from '../../../entities/store.entity';
import { ReleaseStore } from '../../../entities/release-store.entity';
import { TrackRightsController } from '../../../entities/track-rights-controller.entity';
import { ReleaseGenre } from '../../../entities/release-genre.entity';
import { ReleaseTerritoryDetail } from '../../../entities/release-territory-detail.entity';
import { RelatedRelease } from '../../../entities/related-release.entity';
import { ErnReferenceManager } from '../helpers/ern-reference-manager';

export interface ErnContext {
  /** The release with flat cover art fields. */
  release: Release;

  /** Tracks ordered by discNumber, trackNumber, each with audioFiles loaded. */
  tracks: Track[];

  /** Release-level contributors with contributor relation loaded. */
  releaseContributors: ReleaseContributor[];

  /** Track-level contributors keyed by trackId, with contributor relation loaded. */
  trackContributorsMap: Map<string, TrackContributor[]>;

  /** Release labels with label relation loaded. */
  releaseLabels: ReleaseLabel[];

  /** Active deals filtered by isActive=true and matching storeId or null (global). */
  deals: Deal[];

  /** The target store for this ERN message. */
  store: Store;

  /** The release–store join record (for ddexMessageId tracking). */
  releaseStore: ReleaseStore;

  /** Track rights controllers keyed by trackId. */
  trackRightsControllersMap: Map<string, TrackRightsController[]>;

  /** Release genres with genre relation loaded. */
  genres: ReleaseGenre[];

  /** Territory-specific overrides for title, artist name, label. */
  territoryDetails: ReleaseTerritoryDetail[];

  /** Related releases (remasters, deluxe versions, etc.). */
  relatedReleases: RelatedRelease[];

  // ---- Computed by the orchestrator ----

  /** Platform's DDEX Party ID (from env DDEX_SENDER_DPID). */
  senderDpid: string;

  /** Primary label name (used as sender name). */
  senderName: string;

  /** Target store's DDEX Party ID. */
  recipientDpid: string;

  /** Target store name. */
  recipientName: string;

  /** Unique message ID: {senderDpid}:{timestamp}:{uuid-fragment}. */
  messageId: string;

  /** Whether this is the first delivery or an update. */
  updateIndicator: 'OriginalMessage' | 'UpdateMessage';

  /** Shared reference manager for cross-referencing IDs. */
  refs: ErnReferenceManager;
}
