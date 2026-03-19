import { useMemo } from "react";
import { Release } from "@/types/models/release.types";
import { ColumnDef, Row } from "@tanstack/react-table";
import { capitalizeString, formatDate, getStatusBackgroundColor } from "@/utils/strings.helper";
import CustomPopover from "@/components/inputs/CustomPopover";
import TableActionButton from "@/components/inputs/TableActionButton";
import { faCircleInfo, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ellipsisHClassName } from "@/constants/input.constants";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

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
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => <span className={getStatusBackgroundColor(row?.original?.status)}>{capitalizeString(row?.original?.status)}</span>,
      },
      {
        header: 'Type',
        accessorKey: 'type',
        cell: ({ row }) => capitalizeString(row?.original?.type),
      },
      {
        header: 'Parental Advisory',
        accessorKey: 'parentalAdvisory',
        cell: ({ row }) => capitalizeString(row?.original?.parentalAdvisory),
      },
      {
        header: 'Last updated',
        accessorKey: 'updatedAt',
        cell: ({ row }) =>
          formatDate(row?.original?.updatedAt, 'DD/MM/YYYY HH:mm'),
      },
      {
        header: 'Actions',
        accessorKey: 'actions',
        cell: ({ row }: { row: Row<Release> }) => {
          return (
            <CustomPopover trigger={<FontAwesomeIcon icon={faEllipsisH} className={ellipsisHClassName} />}>
              <menu className="w-full flex flex-col items-center gap-1">
                <TableActionButton icon={faCircleInfo} to={`/releases/${row?.original?.id}`}>
                  View details
                </TableActionButton>
                <TableActionButton icon={faPenToSquare} to={`/releases/${row?.original?.id}/wizard`}>
                  Resume
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
