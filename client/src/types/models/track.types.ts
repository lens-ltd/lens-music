import type { AbstractEntity } from './index.types';
import type { Release } from './release.types';
import { ReleaseParentalAdvisory } from './release.types';

export enum TrackStatus {
  DRAFT = 'DRAFT',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  LIVE = 'LIVE',
  TAKENDOWN = 'TAKENDOWN',
}

export interface TrackLyrics {
  id: string;
}

export interface Track extends AbstractEntity {
  releaseId: string;
  title: string;
  titleVersion?: string;
  isrc?: string;
  iswc?: string;
  discNumber: number;
  trackNumber: number;
  durationMs: number;
  bpm?: string;
  musicalKey?: string;
  parentalAdvisory: ReleaseParentalAdvisory;
  primaryLanguage?: string;
  previewStartMs?: number;
  isBonusTrack: boolean;
  isHiddenTrack: boolean;
  cLineYear?: number;
  cLineOwner?: string;
  pLineYear?: number;
  pLineOwner?: string;
  status: TrackStatus;
  release: Release;
  lyrics: TrackLyrics[];
}
