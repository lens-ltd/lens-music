import { useMemo } from "react";
import { Release } from "@/types/models/release.types";
import { ColumnDef, Row } from "@tanstack/react-table";
import { formatDate } from "@/utils/strings.helper";
import CustomPopover from "@/components/inputs/CustomPopover";
import TableActionButton from "@/components/inputs/TableActionButton";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ellipsisHClassName } from "@/constants/input.constants";

export const useReleaseColumns = () => {
  const releaseColumns = useMemo<ColumnDef<Release>[]>(
    () => [
      {
        header: 'No',
        accessorKey: 'no',
        cell: ({ row }) => row.index + 1,
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
        header: 'Version',
        accessorKey: 'version',
        cell: ({ row }) => (
          <span className="capitalize">{row.original.version}</span>
        ),
      },
      {
        header: 'Production Year',
        accessorKey: 'productionYear',
      },
      {
        header: 'Last updated',
        accessorKey: 'updatedAt',
        cell: ({ row }) =>
          formatDate(row.original.updatedAt),
      },
      {
        header: 'Actions',
        accessorKey: 'actions',
        cell: ({ row }: { row: Row<Release> }) => {
          return (
            <CustomPopover trigger={<FontAwesomeIcon icon={faEllipsisH} className={ellipsisHClassName} />}>
              <menu className="w-full flex items-center gap-3">
                <TableActionButton to={`/releases/${row?.original?.id}`}>
                  View details
                </TableActionButton>
              </menu>
            </CustomPopover>
          );
        },
      },
    ],
    []
  );

  return { releaseColumns };
};
