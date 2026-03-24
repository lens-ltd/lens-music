import { AbstractEntity } from './index.types';
import { Genre } from './genre.types';

export enum ReleaseGenreType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
}

export interface ReleaseGenre extends AbstractEntity {
  releaseId: string;
  genreId: string;
  type: ReleaseGenreType;
  genre?: Genre;
}
