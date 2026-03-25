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
  VALIDATED = 'VALIDATED',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  DELIVERED = 'DELIVERED',
  LIVE = 'LIVE',
  TAKENDOWN = 'TAKENDOWN',
}


export enum ReleaseGenreType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
}

export interface ReleaseRightsLine {
  year: number;
  owner: string;
}

export const RELEASE_TYPE_TRACK_LIMITS: Record<
  ReleaseType,
  { min: number; max: number }
> = {
  [ReleaseType.SINGLE]: { min: 1, max: 3 },
  [ReleaseType.EP]: { min: 4, max: 6 },
  [ReleaseType.ALBUM]: { min: 7, max: Infinity },
  [ReleaseType.COMPILATION]: { min: 1, max: Infinity },
  [ReleaseType.MIXTAPE]: { min: 1, max: Infinity },
};
