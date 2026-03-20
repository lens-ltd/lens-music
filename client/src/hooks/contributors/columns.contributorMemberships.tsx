import CustomPopover from "@/components/inputs/CustomPopover";
import TableActionButton from "@/components/inputs/TableActionButton";
import { ellipsisHClassName } from "@/constants/input.constants";
import { ContributorMembership } from "@/types/models/contributor.types";
import {
  capitalizeString,
  formatDate,
  getStatusBackgroundColor,
} from "@/utils/strings.helper";
import { faCircleInfo, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

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
                <FontAwesomeIcon
                  icon={faEllipsisH}
                  className={ellipsisHClassName}
                />
              }
            >
              <menu className="w-full flex flex-col items-center gap-1">
                <TableActionButton
                  to={`/contributors/${row?.original?.parentContributor?.id}`}
                  icon={faCircleInfo}
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
