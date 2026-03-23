import type { AbstractEntity } from './index.types';
import type { Release } from './release.types';
import type { ContributorRole } from './releaseContributor.types';
import { ReleaseParentalAdvisory } from './release.types';

export enum TrackStatus {
  DRAFT = 'DRAFT',
  VALIDATED = 'VALIDATED',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  LIVE = 'LIVE',
  TAKENDOWN = 'TAKENDOWN',
}

export enum AudioFileType {
  ORIGINAL = 'ORIGINAL',
  WAV = 'WAV',
  FLAC = 'FLAC',
  MP3_320 = 'MP3_320',
  MP3_128 = 'MP3_128',
  AAC = 'AAC',
  OGG = 'OGG',
}

export interface AudioFile extends AbstractEntity {
  trackId: string;
  fileType: AudioFileType;
  storagePath: string;
  cloudinaryPublicId?: string;
  fileSizeBytes?: number;
  checksumSha256?: string;
  sampleRate?: number;
  bitDepth?: number;
  channels: number;
  durationMs?: number;
  isPrimary: boolean;
  uploadedAt: string;
  uploadedById?: string;
}

export interface TrackContributor extends AbstractEntity {
  trackId: string;
  contributorId: string;
  role: ContributorRole;
  contributor?: {
    id: string;
    name?: string;
    displayName?: string;
  };
}

export interface TimedLyricLine {
  time?: number;
  text: string;
}

export interface TrackLyrics extends AbstractEntity {
  trackId: string;
  language: string;
  content: TimedLyricLine[];
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
  audioFiles: AudioFile[];
  trackContributors: TrackContributor[];
}
