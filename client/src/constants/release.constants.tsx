import { useMemo } from 'react';
import { Release } from '@/types/models/release.types';
import { formatDate } from '@/utils/strings.helper';
import { Row, ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

export const useReleaseColumns = () => {
  const columns = useMemo<ColumnDef<Release>[]>(
    () => [
      {
        header: 'No',
        accessorKey: 'no',
        cell: ({ row }: { row: Row<Release> }) => row.index + 1,
      },
      {
        header: 'Catalog Number',
        accessorKey: 'catalogNumber',
      },
      {
        header: 'Title',
        accessorKey: 'title',
      },
      {
        header: 'Label',
        accessorKey: 'label',
        cell: ({ row }: { row: Row<Release> }) => (
          <Link
            to={`/labels/${row?.original?.label?.id}`}
            className="text-[13px] underline"
          >
            {row.original.label?.name}
          </Link>
        ),
      },
      {
        header: 'Version',
        accessorKey: 'version',
        cell: ({ row }: { row: Row<Release> }) => (
          <span className="capitalize">{row.original.version}</span>
        ),
      },
      {
        header: 'Release Date',
        accessorKey: 'releaseDate',
        cell: ({ row }: { row: Row<Release> }) =>
          formatDate(row.original.releaseDate),
      },
      {
        header: 'Production Year',
        accessorKey: 'productionYear',
      },
      {
        header: 'Last updated',
        accessorKey: 'updatedAt',
        cell: ({ row }: { row: Row<Release> }) =>
          formatDate(row.original.updatedAt),
      },
    ],
    []
  );

  return columns;
};
