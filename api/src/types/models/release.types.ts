import { Release } from '../../entities/release.entity';
import { Pagination } from '../../helpers/pagination.helper';

export interface ReleasePagination extends Pagination {
  rows: Release[];
}
