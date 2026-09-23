import { useMemo } from "react";
import { setDeleteReleaseModal, setSelectedRelease } from "@/state/features/releaseSlice";
import { useAppDispatch } from "@/state/hooks";
import { Release } from "@/types/models/release.types";
import { ColumnDef, Row } from "@tanstack/react-table";
import { capitalizeString, formatDate, getStatusBackgroundColor } from "@/utils/strings.helper";
import CustomPopover from "@/components/inputs/CustomPopover";
import TableActionButton from "@/components/inputs/TableActionButton";
import { ellipsisHClassName } from "@/constants/input.constants";

import { LuEllipsis, LuInfo, LuSquarePen, LuTrash2 } from 'react-icons/lu';

export const useReleaseColumns = () => {
  const dispatch = useAppDispatch();

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
            <CustomPopover trigger={<button type="button" className={ellipsisHClassName} aria-label="More actions"><LuEllipsis className="size-4" aria-hidden="true" /></button>}>
              <menu className="m-0 flex w-full flex-col gap-0.5 p-0">
                <TableActionButton icon={LuInfo} to={`/releases/${row?.original?.id}`}>
                  View details
                </TableActionButton>
                <TableActionButton icon={LuSquarePen} to={`/releases/${row?.original?.id}/wizard`}>
                  Resume
                </TableActionButton>
                <TableActionButton icon={LuTrash2} iconClassName="text-(--danger)" onClick={(e) => {
                  e.preventDefault();
                  if (row?.original?.id) {
                    dispatch(setSelectedRelease(row.original));
                    dispatch(setDeleteReleaseModal(true));
                  }
                }}>
                  Delete
                </TableActionButton>
              </menu>
            </CustomPopover>
          );
        },
      },
    ],
    [dispatch]
  );

  return { releaseColumns };
};
