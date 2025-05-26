import { Label } from "@/types/models/label.types";
import { Row } from "@tanstack/react-table";
import { getCountryName } from "./countries.constants";
import { formatDate } from "@/utils/strings.helper";

export const labelColumns = [
  {
    header: 'No',
    accessorKey: 'no',
    cell: ({ row }: { row: Row<Label> }) => row.index + 1,
  },
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Email',
    accessorKey: 'email',
    cell: ({ row }: { row: Row<Label> }) => row?.original?.email || '-',
  },
  {
    header: 'Description',
    accessorKey: 'description',
    cell: ({ row }: { row: Row<Label> }) => row?.original?.description || '-',
  },
  {
    header: 'Country',
    accessorKey: 'country',
    cell: ({ row }: { row: Row<Label> }) =>
      getCountryName(row?.original?.country),
  },
  {
    header: 'Last Updated',
    accessorKey: 'updatedAt',
    cell: ({ row }: { row: Row<Label> }) =>
      formatDate(row?.original?.updatedAt),
  },
];