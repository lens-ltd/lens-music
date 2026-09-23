import CustomPopover from "@/components/inputs/CustomPopover";
import CustomTooltip from "@/components/inputs/CustomTooltip";
import TableActionButton from "@/components/inputs/TableActionButton";
import { ellipsisHClassName } from "@/constants/input.constants";
import { PERMISSIONS } from "@/constants/permission.constants";
import {
  setDeleteContributorModal,
  setRejectContributorModal,
  setSelectedContributor,
  setVerifyContributorModal,
} from "@/state/features/contributorSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import {
  Contributor,
  ContributorType,
  ContributorVerificationStatus,
} from "@/types/models/contributor.types";
import {
  capitalizeString,
  formatDate,
  getStatusBackgroundColor,
} from "@/utils/strings.helper";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

import { LuBadgeCheck, LuCircleCheck, LuCircleX, LuEllipsis, LuInfo, LuSquarePen, LuTrash2, LuUsers } from 'react-icons/lu';

// CONTRIBUTOR COLUMNS
export const useContributorColumns = () => {
  // STATE
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const permissions = user?.permissions;
  const isAdminAssigner = permissions?.includes(
    PERMISSIONS.ASSIGN_CONTRIBUTOR_MANAGER,
  );

  const contributorColumns = useMemo<ColumnDef<Contributor>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => (
          <p className="font-normal text-[13px] flex items-center gap-1">
            {row?.original?.displayName || row?.original?.name}{" "}
            {row?.original?.verificationStatus ===
              ContributorVerificationStatus.VERIFIED && (
              <CustomTooltip label="Verified">
                <LuCircleCheck
                 
                  className="text-(--signal) cursor-pointer text-[13px]" />
              </CustomTooltip>
            )}
          </p>
        ),
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Phone Number",
        accessorKey: "phoneNumber",
      },
      {
        header: "Verification Status",
        accessorKey: "verificationStatus",
        cell: ({ row }) =>
          row?.original?.verificationStatus ? (
            <span
              className={getStatusBackgroundColor(
                row?.original?.verificationStatus,
              )}
            >
              {capitalizeString(row?.original?.verificationStatus)}
            </span>
          ) : (
            "-"
          ),
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: ({ row }) =>
          capitalizeString(row?.original?.type as ContributorType),
      },
      {
        header: "Last Updated",
        accessorKey: "updatedAt",
        cell: ({ row }) =>
          row?.original?.updatedAt
            ? formatDate(row?.original?.updatedAt, "DD/MM/YYYY HH:mm")
            : "-",
      },
      {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => {

          const canVerify = [PERMISSIONS.VERIFY_CONTRIBUTOR].some((permission) =>
            permissions?.includes(permission),
          );
          const canUpdate = permissions?.includes(PERMISSIONS.UPDATE_CONTRIBUTOR);
          const canDelete = permissions?.includes(PERMISSIONS.DELETE_CONTRIBUTOR);
          // Admins (assign rights) can act on any row; non-admins need assignment (API-enforced).
          // List rows don't include canManage — show mutate actions when permission allows;
          // details page uses currentUserCanManage for stricter gating.
          const showMutateActions = Boolean(isAdminAssigner || canUpdate || canVerify || canDelete);

          let verificationLabel = "Verify";
          let verificationIcon = LuBadgeCheck;
          if (['PENDING_VERIFICATION'].includes(row?.original?.verificationStatus)) {
            verificationLabel = "Approve verification";
            verificationIcon = LuCircleCheck;
          }

          return (
            <CustomPopover
              trigger={
                <button type="button" className={ellipsisHClassName} aria-label="More actions"><LuEllipsis className="size-4" aria-hidden="true" /></button>
              }
            >
              <menu className="m-0 flex w-full flex-col gap-0.5 p-0">
                <TableActionButton
                  icon={LuInfo}
                  to={`/contributors/${row?.original?.id}`}
                >
                  View details
                </TableActionButton>
                {canUpdate && showMutateActions && (
                  <TableActionButton
                    icon={LuSquarePen}
                    to={`/contributors/${row?.original?.id}/update`}
                  >
                    Manage
                  </TableActionButton>
                )}
                {canVerify && !['VERIFIED'].includes(row?.original?.verificationStatus) && (
                  <TableActionButton
                    icon={verificationIcon}
                    iconClassName="text-(--signal)"
                    onClick={(e) => {
                      e.preventDefault();
                      if (row?.original?.id) {
                        dispatch(setSelectedContributor(row?.original));
                        dispatch(setVerifyContributorModal(true));
                      }
                    }}
                  >
                    {verificationLabel}
                  </TableActionButton>
                )}
                {canVerify &&
                  !([
                    ContributorVerificationStatus.NOT_VERIFIED,
                  ] as string[]).includes(row?.original?.verificationStatus) && (
                    <TableActionButton
                      icon={LuCircleX}
                      iconClassName="text-(--danger) text-[13px]"
                      onClick={(e) => {
                        e.preventDefault();
                        if (row?.original?.id) {
                          dispatch(setSelectedContributor(row?.original));
                          dispatch(setRejectContributorModal(true));
                        }
                      }}
                    >
                      Reject
                    </TableActionButton>
                  )}
                {canUpdate &&
                  [ContributorType.GROUP].includes(
                    row?.original?.type as ContributorType,
                  ) && (
                  <TableActionButton
                    icon={LuUsers}
                    to={`/contributors/${row?.original?.id}/memberships`}
                  >
                    Manage memberships
                  </TableActionButton>
                )}
                {canDelete && (
                  <TableActionButton
                    icon={LuTrash2}
                    iconClassName="text-(--danger)"
                    onClick={(e) => {
                      e.preventDefault();
                      if (row?.original?.id) {
                        dispatch(setSelectedContributor(row?.original));
                        dispatch(setDeleteContributorModal(true));
                      }
                    }}
                  >
                    Delete
                  </TableActionButton>
                )}
              </menu>
            </CustomPopover>
          );
        },
      },
    ],
    [dispatch, permissions, isAdminAssigner],
  );

  return { contributorColumns };
};
