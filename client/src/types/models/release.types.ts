import { AbstractEntity } from './index.types';
import { User } from './user.types';
import { Track } from './track.types';
import { ReleaseGenre } from './releaseGenre.types';

export enum ReleaseType {
  ALBUM = 'ALBUM',
  EP = 'EP',
  SINGLE = 'SINGLE',
  COMPILATION = 'COMPILATION',
  MIXTAPE = 'MIXTAPE',
}

export enum ReleaseParentalAdvisory {
  EXPLICIT = 'EXPLICIT',
  CLEAN = 'CLEAN',
  NOT_EXPLICIT = 'NOT_EXPLICIT',
}

export enum ReleaseStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  DELIVERED = 'DELIVERED',
  LIVE = 'LIVE',
  TAKENDOWN = 'TAKENDOWN',
}

export interface ReleaseRightsLine {
  year: number;
  owner: string;
}

export interface Release extends AbstractEntity {
  title: string;
  upc?: string;
  version?: string;
  coverArtUrl?: string;
  productionYear: number;
  catalogNumber?: string;
  titleVersion?: string;
  type?: ReleaseType;
  primaryLanguage?: string;
  cLine?: ReleaseRightsLine | null;
  pLine?: ReleaseRightsLine | null;
  originalReleaseDate?: string;
  digitalReleaseDate?: string;
  preorderDate?: string;
  parentalAdvisory: ReleaseParentalAdvisory;
  status: ReleaseStatus;
  metadataLanguage?: string;
  territories?: string[];
  createdById?: string;
  createdBy?: User | null;
  tracks: Track[];
  genres: ReleaseGenre[];
}
