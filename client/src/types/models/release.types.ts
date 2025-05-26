import { AbstractEntity } from './index.types';
import { Label } from './label.types';
import { User } from './user.types';
import { ReleaseArtist } from './releaseArtist.types';

export interface Release extends AbstractEntity {
  title: string;
  coverArt?: string;
  upc?: string;
  releaseDate: string;
  version?: string;
  productionYear: number;
  catalogNumber?: string;
  labelId?: string;
  userId: string;
  label?: Label;
  user: User;
  artists: ReleaseArtist[];
}
