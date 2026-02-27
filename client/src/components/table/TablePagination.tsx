import {
  ChevronLeftIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { UnknownAction } from '@reduxjs/toolkit';
import { Table } from '@tanstack/react-table';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  page?: number;
  size?: number;
  totalCount?: number;
  totalPages?: number;
  setPage?: (page: number) => UnknownAction;
  setSize?: (size: number) => UnknownAction;
}

export function DataTablePagination<TData>({
  table,
  page = 0,
  size = 10,
  totalCount = 0,
  totalPages = 0,
  setPage,
  setSize,
}: DataTablePaginationProps<TData>) {
  // page is 0-based; derive 1-based values for display only
  const lastPageIndex = Math.max((totalPages || 1) - 1, 0);
  const displayPage = page + 1;
  const displayTotal = totalPages || 1;

  return (
    <footer
      className="flex flex-col items-center gap-4 px-2 mt-4
                   md:flex-row md:justify-between"
    >
      <article
        className="flex flex-col gap-1 w-full text-center
                      md:w-auto md:text-left"
      >
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </p>
        )}
        {totalCount > 0 && (
          <p className="text-xs">Total records: {totalCount}</p>
        )}
      </article>

      <menu
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3
                     md:justify-end md:gap-x-6"
      >
        <section className="flex items-center space-x-2">
          <p className="hidden text-sm font-medium sm:block">Rows per page</p>
          <Select
            value={`${size}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
              if (setSize) {
                setSize(Number(value));
              }
            }}
          >
            <SelectTrigger className="h-8 w-[70px] text-[10px]">
              <SelectValue placeholder={size} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 50].map((pageSize) => (
                <SelectItem
                  value={`${pageSize}`}
                  key={pageSize}
                  className="cursor-pointer text-[10px] hover:bg-background"
                >
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        <section className="flex items-center gap-2">
          <p className="text-sm font-medium whitespace-nowrap">
            Page {displayPage} of {displayTotal}
          </p>
          <input
            type="number"
            min={1}
            max={displayTotal}
            defaultValue={displayPage}
            className="w-12 text-center placeholder:text-xs text-xs py-1 px-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            onChange={(e) => {
              const entered = e.target.value ? Number(e.target.value) : null;
              if (entered !== null && entered >= 1 && entered <= displayTotal) {
                const targetIndex = entered - 1;
                table.setPageIndex(targetIndex);
                if (setPage) setPage(targetIndex);
              } else if (!entered) {
                // allow clearing the input
              } else {
                e.target.value = String(displayPage);
              }
            }}
            onBlur={(e) => {
              const val = Number(e.target.value);
              if (!e.target.value || val < 1 || val > displayTotal) {
                e.target.value = String(displayPage);
              }
            }}
            aria-label="Go to page number"
          />
        </section>

        <section className="flex items-center space-x-1">
          <Button
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => {
              table.setPageIndex(0);
              if (setPage) setPage(0);
            }}
            disabled={page === 0}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => {
              table.previousPage();
              if (setPage) setPage(page - 1);
            }}
            disabled={page === 0}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => {
              table.nextPage();
              if (setPage) setPage(page + 1);
            }}
            disabled={page === lastPageIndex}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => {
              table.setPageIndex(lastPageIndex);
              if (setPage) setPage(lastPageIndex);
            }}
            disabled={page === lastPageIndex}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="w-4 h-4" />
          </Button>
        </section>
      </menu>
    </footer>
  );
}
