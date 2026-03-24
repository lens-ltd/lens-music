import { Pagination } from '../../helpers/pagination.helper';
import {
  ReleaseParentalAdvisory,
  ReleaseRightsLine,
  ReleaseStatus,
  ReleaseType,
} from '../../constants/release.constants';
import { UUID } from '../common.types';
import { User } from '../../entities/user.entity';
import { Track } from '../../entities/track.entity';
import { ReleaseGenre } from '../../entities/release-genre.entity';
import { ReleaseLabel } from '../../entities/release-label.entity';

export interface ReleaseModel {
  id: UUID;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  upc?: string;
  version?: string;
  coverArtUrl?: string;
  productionYear: number;
  catalogNumber?: string;
  titleVersion?: string;
  type?: ReleaseType;
  primaryLanguage?: string;
  cLine?: ReleaseRightsLine | null;
  pLine?: ReleaseRightsLine | null;
  originalReleaseDate?: string;
  digitalReleaseDate?: string;
  preorderDate?: string;
  parentalAdvisory: ReleaseParentalAdvisory;
  status: ReleaseStatus;
  metadataLanguage?: string;
  territories?: string[];
  createdById?: UUID;
  createdBy?: User | null;
  tracks: Track[];
  genres: ReleaseGenre[];
  labels: ReleaseLabel[];
}
