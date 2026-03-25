import type { AbstractEntity } from './index.types';
import type { Release } from './release.types';

export enum RelatedReleaseRelationType {
  IS_EQUIVALENT_TO = 'IS_EQUIVALENT_TO',
  IS_REMASTER_OF = 'IS_REMASTER_OF',
  IS_DELUXE_VERSION_OF = 'IS_DELUXE_VERSION_OF',
  REPLACES = 'REPLACES',
}

export interface RelatedRelease extends AbstractEntity {
  releaseId: string;
  relatedReleaseId?: string;
  relationType: RelatedReleaseRelationType;
  externalId?: string;
  relatedRelease?: Release;
}

export interface RelatedReleasePayload {
  relatedReleaseId?: string;
  relationType?: RelatedReleaseRelationType;
  externalId?: string;
}
