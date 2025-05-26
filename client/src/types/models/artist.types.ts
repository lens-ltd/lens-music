import { AbstractEntity } from './index.types';
import { ReleaseArtist } from './releaseArtist.types';
import { User } from './user.types';

export interface Artist extends AbstractEntity {
  name: string;
  status: string;
  userId: string;
  user: User;
  releases: ReleaseArtist[];
}
