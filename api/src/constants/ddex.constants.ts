import { ContributorRole } from './contributor.constants';

// --- DDEX ERN 4.x Enums ---

export enum CommercialModelType {
  PAY_AS_YOU_GO = 'PAY_AS_YOU_GO',
  SUBSCRIPTION = 'SUBSCRIPTION',
  ADVERTISEMENT_SUPPORTED = 'ADVERTISEMENT_SUPPORTED',
  FREE = 'FREE',
}

export enum UseType {
  ON_DEMAND_STREAM = 'ON_DEMAND_STREAM',
  PERMANENT_DOWNLOAD = 'PERMANENT_DOWNLOAD',
  CONDITIONAL_DOWNLOAD = 'CONDITIONAL_DOWNLOAD',
  NON_INTERACTIVE_STREAM = 'NON_INTERACTIVE_STREAM',
  TETHERED_DOWNLOAD = 'TETHERED_DOWNLOAD',
}

export enum RightType {
  MAKING_AVAILABLE_RIGHT = 'MAKING_AVAILABLE_RIGHT',
  MECHANICAL_RIGHT = 'MECHANICAL_RIGHT',
  PERFORMANCE_RIGHT = 'PERFORMANCE_RIGHT',
  SYNCHRONIZATION_RIGHT = 'SYNCHRONIZATION_RIGHT',
  REPRODUCTION_RIGHT = 'REPRODUCTION_RIGHT',
}

export enum SoundRecordingType {
  MUSICAL_WORK_SOUND_RECORDING = 'MUSICAL_WORK_SOUND_RECORDING',
  SPOKEN_WORD_SOUND_RECORDING = 'SPOKEN_WORD_SOUND_RECORDING',
  SOUND_EFFECT = 'SOUND_EFFECT',
  RINGTONE = 'RINGTONE',
}

export enum DdexAcknowledgmentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  ERROR = 'ERROR',
}

export enum PriceType {
  WHOLESALE = 'WHOLESALE',
  RETAIL = 'RETAIL',
  SUGGESTED_RETAIL = 'SUGGESTED_RETAIL',
}

export enum DeliveryProtocol {
  SFTP = 'SFTP',
  HTTPS = 'HTTPS',
  API = 'API',
}

// --- ContributorRole → DDEX PartyRole Mapping ---

export const CONTRIBUTOR_ROLE_TO_DDEX_MAP: Record<ContributorRole, string> = {
  [ContributorRole.PRIMARY_ARTIST]: 'MainArtist',
  [ContributorRole.FEATURED_ARTIST]: 'FeaturedArtist',
  [ContributorRole.VOCALIST]: 'Vocalist',
  [ContributorRole.BACKING_VOCALS]: 'BackgroundVocalist',
  [ContributorRole.INSTRUMENTALIST]: 'Instrumentalist',
  [ContributorRole.SONGWRITER]: 'Songwriter',
  [ContributorRole.COMPOSER]: 'Composer',
  [ContributorRole.LYRICIST]: 'Lyricist',
  [ContributorRole.PRODUCER]: 'Producer',
  [ContributorRole.CO_PRODUCER]: 'Producer',
  [ContributorRole.EXECUTIVE_PRODUCER]: 'ExecutiveProducer',
  [ContributorRole.MIXING_ENGINEER]: 'MixingEngineer',
  [ContributorRole.MASTERING_ENGINEER]: 'MasteringEngineer',
  [ContributorRole.RECORDING_ENGINEER]: 'StudioPersonnel',
  [ContributorRole.ARRANGER]: 'Arranger',
  [ContributorRole.PUBLISHER]: 'MusicPublisher',
  [ContributorRole.COPYRIGHT_OWNER]: 'RightsController',
  [ContributorRole.REMIXER]: 'Remixer',
  [ContributorRole.DJ]: 'DJ',
  [ContributorRole.CONDUCTOR]: 'Conductor',
  [ContributorRole.CHOIR_MASTER]: 'ChoirMaster',
  [ContributorRole.NARRATOR]: 'Narrator',
};

// --- AudioFileType → DDEX AudioCodecType Mapping ---

export const AUDIO_FILE_TYPE_TO_DDEX_CODEC: Record<string, string> = {
  ORIGINAL: 'PCM',
  WAV: 'PCM',
  FLAC: 'FLAC',
  MP3_320: 'MP3',
  MP3_128: 'MP3',
  AAC: 'AAC',
  OGG: 'Vorbis',
};
