import { Artist } from '@/types/models/artist.types';
import { capitalizeString, formatDate } from '@/utils/strings.helper';
import { Row } from '@tanstack/react-table';

export const artistColumns = [
  {
    header: 'No',
    accessorKey: 'no',
    cell: ({ row }: { row: Row<Artist> }) => row.index + 1,
  },
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }: { row: Row<Artist> }) =>
      capitalizeString(row?.original?.status),
  },
  {
    header: 'Last Updated',
    accessorKey: 'updatedAt',
    cell: ({ row }: { row: Row<Artist> }) =>
      formatDate(row?.original?.updatedAt),
  },
];
