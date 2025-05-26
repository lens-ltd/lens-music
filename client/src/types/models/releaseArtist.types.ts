import { AbstractEntity } from './index.types';
import { Release } from './release.types';
import { Artist } from './artist.types';

export interface ReleaseArtist extends AbstractEntity {
  releaseId: string;
  artistId: string;
  release: Release;
  artist: Artist;
}
