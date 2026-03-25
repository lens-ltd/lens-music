import { ReleaseType } from './release.constants';

/**
 * Maps platform release type to DDEX ReleaseType / AlbumType style values for ERN.
 */
export const RELEASE_TYPE_TO_DDEX_VALUE: Record<ReleaseType, string> = {
  [ReleaseType.ALBUM]: 'Album',
  [ReleaseType.EP]: 'EP',
  [ReleaseType.SINGLE]: 'Single',
  [ReleaseType.COMPILATION]: 'Compilation',
  [ReleaseType.MIXTAPE]: 'Album',
};
