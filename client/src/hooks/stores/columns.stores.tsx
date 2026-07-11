import CustomPopover from "@/components/inputs/CustomPopover";
import TableActionButton from "@/components/inputs/TableActionButton";
import { ellipsisHClassName } from "@/constants/input.constants";
import { Store } from "@/types/models/store.types";
import {
  capitalizeString,
  formatDate,
  getStatusBackgroundColor,
} from "@/utils/strings.helper";
import { faCircleInfo, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

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
          <span className="font-mono text-[11px] text-[color:var(--lens-ink)]/70">
            {row.original.slug || "—"}
          </span>
        ),
      },
      {
        header: "DDEX Party ID",
        accessorKey: "ddexPartyId",
        cell: ({ row }) => row.original.ddexPartyId || "—",
      },
      {
        header: "Protocol",
        accessorKey: "deliveryProtocol",
        cell: ({ row }) => row.original.deliveryProtocol || "—",
      },
      {
        header: "Endpoint",
        accessorKey: "deliveryEndpoint",
        cell: ({ row }) => (
          <span className="block max-w-[180px] truncate" title={row.original.deliveryEndpoint}>
            {row.original.deliveryEndpoint || "—"}
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
              <FontAwesomeIcon
                icon={faEllipsisH}
                className={ellipsisHClassName}
              />
            }
          >
            <menu className="w-full flex flex-col items-center gap-1">
              <TableActionButton
                icon={faCircleInfo}
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
