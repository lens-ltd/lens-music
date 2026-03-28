import { ReleaseParentalAdvisory } from '../../../constants/release.constants';
import {
  CommercialModelType,
  UseType,
  SoundRecordingType,
} from '../../../constants/ddex.constants';

/**
 * Convert milliseconds to ISO 8601 duration (e.g. 204000 → "PT3M24S").
 */
export function msToIsoDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let result = 'PT';
  if (hours > 0) result += `${hours}H`;
  if (minutes > 0) result += `${minutes}M`;
  if (seconds > 0 || result === 'PT') result += `${seconds}S`;
  return result;
}

/**
 * Format a date as DDEX date string (YYYY-MM-DD).
 */
export function formatDdexDate(date: string | Date): string {
  if (typeof date === 'string') return date.slice(0, 10);
  return date.toISOString().slice(0, 10);
}

/**
 * Format a Date as DDEX datetime string (ISO 8601 with Z).
 */
export function formatDdexDateTime(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export const PARENTAL_ADVISORY_TO_DDEX: Record<ReleaseParentalAdvisory, string> = {
  [ReleaseParentalAdvisory.EXPLICIT]: 'Explicit',
  [ReleaseParentalAdvisory.CLEAN]: 'Edited',
  [ReleaseParentalAdvisory.NOT_EXPLICIT]: 'NotExplicit',
};

export const COMMERCIAL_MODEL_TO_DDEX: Record<CommercialModelType, string> = {
  [CommercialModelType.PAY_AS_YOU_GO]: 'PayAsYouGoModel',
  [CommercialModelType.SUBSCRIPTION]: 'SubscriptionModel',
  [CommercialModelType.ADVERTISEMENT_SUPPORTED]: 'AdvertisementSupportedModel',
  [CommercialModelType.FREE]: 'FreeOfChargeModel',
};

export const USE_TYPE_TO_DDEX: Record<UseType, string> = {
  [UseType.ON_DEMAND_STREAM]: 'OnDemandStream',
  [UseType.PERMANENT_DOWNLOAD]: 'PermanentDownload',
  [UseType.CONDITIONAL_DOWNLOAD]: 'ConditionalDownload',
  [UseType.NON_INTERACTIVE_STREAM]: 'NonInteractiveStream',
  [UseType.TETHERED_DOWNLOAD]: 'TetheredDownload',
};

export const SOUND_RECORDING_TYPE_TO_DDEX: Record<SoundRecordingType, string> = {
  [SoundRecordingType.MUSICAL_WORK_SOUND_RECORDING]: 'MusicalWorkSoundRecording',
  [SoundRecordingType.SPOKEN_WORD_SOUND_RECORDING]: 'SpokenWordSoundRecording',
  [SoundRecordingType.SOUND_EFFECT]: 'SoundEffect',
  [SoundRecordingType.RINGTONE]: 'Ringtone',
};
