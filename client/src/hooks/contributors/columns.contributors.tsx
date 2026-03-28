import CustomPopover from "@/components/inputs/CustomPopover";
import CustomTooltip from "@/components/inputs/CustomTooltip";
import TableActionButton from "@/components/inputs/TableActionButton";
import { ellipsisHClassName } from "@/constants/input.constants";
import { PERMISSIONS } from "@/constants/permission.constants";
import {
  setDeleteContributorModal,
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
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import {
  faCertificate,
  faCircleCheck,
  faCircleInfo,
  faEllipsisH,
  faTrash,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

// CONTRIBUTOR COLUMNS
export const useContributorColumns = () => {
  // STATE
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const permissions = user?.permissions;

  const contributorColumns = useMemo<ColumnDef<Contributor>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => (
          <p className="font-normal text-[12px] flex items-center gap-1">
            {row?.original?.displayName || row?.original?.name}{" "}
            {row?.original?.verificationStatus ===
              ContributorVerificationStatus.VERIFIED && (
              <CustomTooltip label="Verified">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="text-primary cursor-pointer text-[12px]"
                />
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

          let verificationLabel = "Verify";
          let verificationIcon = faCertificate;
          if (['PENDING_VERIFICATION'].includes(row?.original?.verificationStatus)) {
            verificationLabel = "Approve verification";
            verificationIcon = faCircleCheck;
          }

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
                  icon={faCircleInfo}
                  to={`/contributors/${row?.original?.id}`}
                >
                  View details
                </TableActionButton>
                <TableActionButton
                  icon={faPenToSquare}
                  to={`/contributors/${row?.original?.id}/update`}
                >
                  Manage
                </TableActionButton>
                {canVerify && !['VERIFIED'].includes(row?.original?.verificationStatus) && (
                  <TableActionButton
                    icon={verificationIcon}
                    iconClassName="text-primary"
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
                {[ContributorType.GROUP].includes(
                  row?.original?.type as ContributorType,
                ) && (
                  <TableActionButton
                    icon={faUsers}
                    to={`/contributors/${row?.original?.id}/memberships`}
                  >
                    Manage memberships
                  </TableActionButton>
                )}
                <TableActionButton
                  icon={faTrash}
                  iconClassName="text-red-700"
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
              </menu>
            </CustomPopover>
          );
        },
      },
    ],
    [dispatch, permissions],
  );

  return { contributorColumns };
};
