import CustomPopover from "@/components/inputs/CustomPopover";
import TableActionButton from "@/components/inputs/TableActionButton";
import { ellipsisHClassName } from "@/constants/input.constants";
import { ContributorMembership } from "@/types/models/contributor.types";
import {
  capitalizeString,
  formatDate,
  getStatusBackgroundColor,
} from "@/utils/strings.helper";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

import { LuEllipsis, LuInfo } from 'react-icons/lu';

// MEMBER CONTRIBUTOR MEMBERSHIPS COLUMNS
export const useMemberContributorMembershipsColumns = () => {
  const memberContributorMembershipsColumns = useMemo<
    ColumnDef<ContributorMembership>[]
  >(
    () => [
      {
        header: `Group`,
        accessorKey: "parentContributor",
        cell: ({ row }) =>
          row?.original?.parentContributor?.displayName ||
          row?.original?.parentContributor?.name,
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <p
            className={getStatusBackgroundColor(
              row?.original?.memberContributor?.status,
            )}
          >
            {capitalizeString(row?.original?.memberContributor?.status)}
          </p>
        ),
      },
      {
        header: "Date joined",
        accessorKey: "createdAt",
        cell: ({ row }) =>
          formatDate(row?.original?.createdAt, "DD/MM/YYYY HH:mm"),
      },
      {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => {
          return (
            <CustomPopover
              trigger={
                <button type="button" className={ellipsisHClassName} aria-label="More actions"><LuEllipsis className="size-4" aria-hidden="true" /></button>
              }
            >
              <menu className="m-0 flex w-full flex-col gap-0.5 p-0">
                <TableActionButton
                  to={`/contributors/${row?.original?.parentContributor?.id}`}
                  icon={LuInfo}
                >
                  View details
                </TableActionButton>
              </menu>
            </CustomPopover>
          );
        },
      },
    ],
    [],
  );

  return { memberContributorMembershipsColumns };
};

// PARENT CONTRIBUTOR MEMBERSHIPS COLUMNS
export const useParentContributorMembershipsColumns = () => {
  const parentContributorMembershipsColumns = useMemo<
    ColumnDef<ContributorMembership>[]
  >(
    () => [
      {
        header: "Parent",
        accessorKey: "memberContributor",
        cell: ({ row }) =>
          row?.original?.memberContributor?.displayName ||
          row?.original?.memberContributor?.name,
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <p
            className={getStatusBackgroundColor(
              row?.original?.memberContributor?.status,
            )}
          >
            {capitalizeString(row?.original?.memberContributor?.status)}
          </p>
        ),
      },
      {
        header: "Date joined",
        accessorKey: "createdAt",
        cell: ({ row }) =>
          formatDate(row?.original?.createdAt, "DD/MM/YYYY HH:mm"),
      },
    ],
    [],
  );

  return { parentContributorMembershipsColumns };
};
