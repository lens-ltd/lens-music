import { AbstractEntity } from './index.types';
import type { User } from './user.types';
import type { Release } from './release.types';
import type { Contributor } from './contributor.types';

export enum ContributorRole {
  PRIMARY_ARTIST = 'PRIMARY_ARTIST',
  FEATURED_ARTIST = 'FEATURED_ARTIST',
  VOCALIST = 'VOCALIST',
  BACKING_VOCALS = 'BACKING_VOCALS',
  INSTRUMENTALIST = 'INSTRUMENTALIST',
  SONGWRITER = 'SONGWRITER',
  COMPOSER = 'COMPOSER',
  LYRICIST = 'LYRICIST',
  PRODUCER = 'PRODUCER',
  CO_PRODUCER = 'CO_PRODUCER',
  EXECUTIVE_PRODUCER = 'EXECUTIVE_PRODUCER',
  MIXING_ENGINEER = 'MIXING_ENGINEER',
  MASTERING_ENGINEER = 'MASTERING_ENGINEER',
  RECORDING_ENGINEER = 'RECORDING_ENGINEER',
  ARRANGER = 'ARRANGER',
  PUBLISHER = 'PUBLISHER',
  COPYRIGHT_OWNER = 'COPYRIGHT_OWNER',
}

export interface ReleaseContributor extends AbstractEntity {
  releaseId: string;
  contributorId: string;
  role: ContributorRole;
  createdById: string;
  release: Release;
  contributor: Contributor;
  createdBy: User;
}
