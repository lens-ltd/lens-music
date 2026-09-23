import CustomPopover from "@/components/inputs/CustomPopover";
import TableActionButton from "@/components/inputs/TableActionButton";
import { ellipsisHClassName } from "@/constants/input.constants";
import { Store } from "@/types/models/store.types";
import {
  capitalizeString,
  formatDate,
  getStatusBackgroundColor,
} from "@/utils/strings.helper";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

import { LuEllipsis, LuInfo } from 'react-icons/lu';

export const useStoreColumns = () => {
  const storeColumns = useMemo<ColumnDef<Store>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => row.original.name || "—",
      },
      {
        header: "Slug",
        accessorKey: "slug",
        cell: ({ row }) => (
          <span className="text-xs text-(--muted)">
            {row.original.slug || "—"}
          </span>
        ),
      },
      {
        header: "DDEX Party ID",
        accessorKey: "ddexPartyId",
        cell: ({ row }) => capitalizeString(row.original?.ddexPartyId) || "—",
      },
      {
        header: "Protocol",
        accessorKey: "deliveryProtocol",
        cell: ({ row }) => capitalizeString(row.original?.deliveryProtocol) || "—",
      },
      {
        header: "Endpoint",
        accessorKey: "deliveryEndpoint",
        cell: ({ row }) => (
          <span className="block max-w-[180px] truncate" title={row.original?.deliveryEndpoint}>
            {row.original?.deliveryEndpoint || "—"}
          </span>
        ),
      },
      {
        header: "Status",
        accessorKey: "isActive",
        cell: ({ row }) => {
          const status = row.original.isActive ? "ACTIVE" : "INACTIVE";
          return (
            <span className={getStatusBackgroundColor(status)}>
              {capitalizeString(status)}
            </span>
          );
        },
      },
      {
        header: "Sort",
        accessorKey: "sortOrder",
        cell: ({ row }) => row.original.sortOrder ?? "—",
      },
      {
        header: "Last updated",
        accessorKey: "updatedAt",
        cell: ({ row }) =>
          row.original.updatedAt
            ? formatDate(row.original.updatedAt, "DD/MM/YYYY HH:mm")
            : "—",
      },
      {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => (
          <CustomPopover
            trigger={
              <button type="button" className={ellipsisHClassName} aria-label="More actions"><LuEllipsis className="size-4" aria-hidden="true" /></button>
            }
          >
            <menu className="m-0 flex w-full flex-col gap-0.5 p-0">
              <TableActionButton
                icon={LuInfo}
                to={`/stores/${row.original.id}`}
              >
                View details
              </TableActionButton>
            </menu>
          </CustomPopover>
        ),
      },
    ],
    [],
  );

  return { storeColumns };
};
