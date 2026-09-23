import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { UnknownAction } from "@reduxjs/toolkit";
import { Table } from "@tanstack/react-table";
import { useMemo } from "react";
import { formatNumbers } from "@/utils/strings.helper";

import { LuChevronLeft, LuChevronRight, LuChevronsLeft, LuChevronsRight } from 'react-icons/lu';

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
    <footer className="flex flex-col gap-3 px-4 py-3 text-[13px] text-(--muted) sm:flex-row sm:items-center sm:justify-between">
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
            <SelectTrigger className="h-(--control-sm) min-h-(--control-sm) w-[72px] px-2" aria-label="Rows per page">
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
          size="icon-sm"
          variant="ghost"
          aria-label="Go to first page"
          onClick={() => {
            table.setPageIndex(0);
            if (setPage) setPage(0);
          }}
          disabled={page === 0}
        >
          <LuChevronsLeft className="w-4 h-4" />
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Go to previous page"
          onClick={() => {
            table.previousPage();
            if (setPage) setPage((page - 1) as unknown as number);
          }}
          disabled={page === 0}
        >
          <LuChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Go to next page"
          onClick={() => {
            table.nextPage();
            if (setPage) setPage((page + 1) as unknown as number);
          }}
          disabled={totalPages === 0 || page >= (totalPages - 1)}
        >
          <LuChevronRight className="w-4 h-4" />
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Go to last page"
          onClick={() => {
            table.setPageIndex((totalPages - 1) || 0);
            if (setPage) setPage((totalPages - 1) || 0 as unknown as number);
          }}
          disabled={totalPages === 0 || page >= (totalPages - 1)}
        >
          <LuChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </footer>
  );
}
