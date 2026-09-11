import { ChevronLeftIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { UnknownAction } from "@reduxjs/toolkit";
import { Table } from "@tanstack/react-table";
import { useMemo } from "react";
import { formatNumbers } from "@/utils/strings.helper";

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

  const pageSizeOptions = useMemo(() => {
    const options = [{
      label: '5',
      value: 5,
    }, {
      label: '10',
      value: 10,
    }, {
      label: '20',
      value: 20,
    }, {
      label: '50',
      value: 50,
    }];

    if (totalCount > 50) {
      options.push({
        label: 'All',
        value: totalCount,
      });
    }

    return options;
  }, [totalCount]);

  return (
    <footer className="flex flex-col gap-3 border-t border-(--line) bg-[#f9fbfc] px-4 py-3 text-[13px] text-(--slate) sm:flex-row sm:items-center sm:justify-between">
      <span>
        {totalCount > 0 ? (
          <>{formatNumbers(totalCount)} {totalCount === 1 ? 'record' : 'records'}</>
        ) : (
          <>0 records</>
        )}
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <> · {table.getFilteredSelectedRowModel().rows.length} selected</>
        )}
      </span>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <span>Rows</span>
          <Select
            value={`${size}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
              if (setSize) {
                setSize(Number(value));
              }
            }}
          >
            <SelectTrigger className="h-8 w-[68px] px-2" aria-label="Rows per page">
              <SelectValue placeholder={size} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((option) => (
                <SelectItem
                  value={`${option.value}`}
                  key={option.value}
                >
                  {option?.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-xs tabular-nums">
          {page + 1} / {Math.max(totalPages || 1, 1)}
        </span>
        <Button
          size="icon"
          variant="secondary"
          aria-label="Go to first page"
          onClick={() => {
            table.setPageIndex(0);
            if (setPage) setPage(0);
          }}
          disabled={page === 0}
        >
          <DoubleArrowLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          aria-label="Go to previous page"
          onClick={() => {
            table.previousPage();
            if (setPage) setPage((page - 1) as unknown as number);
          }}
          disabled={page === 0}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          aria-label="Go to next page"
          onClick={() => {
            table.nextPage();
            if (setPage) setPage((page + 1) as unknown as number);
          }}
          disabled={totalPages === 0 || page >= (totalPages - 1)}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          aria-label="Go to last page"
          onClick={() => {
            table.setPageIndex((totalPages - 1) || 0);
            if (setPage) setPage((totalPages - 1) || 0 as unknown as number);
          }}
          disabled={totalPages === 0 || page >= (totalPages - 1)}
        >
          <DoubleArrowRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </footer>
  );
}
