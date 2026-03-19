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
