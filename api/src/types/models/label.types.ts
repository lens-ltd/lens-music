import { Label } from "../../entities/label.entity";
import { Pagination } from "../../helpers/pagination.helper";

export interface LabelPagination extends Pagination {
    rows: Label[];
}