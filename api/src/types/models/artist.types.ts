import { Artist } from '../../entities/artist.entity';
import { Pagination } from '../../helpers/pagination.helper';

export interface ArtistPagination extends Pagination {
  rows: Artist[];
}
