import { useMemo } from "react";
import {
  setApproveReleaseModal,
  setRejectReleaseModal,
  setSelectedRelease,
} from "@/state/features/releaseSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { Release } from "@/types/models/release.types";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  capitalizeString,
  formatDate,
  getStatusBackgroundColor,
} from "@/utils/strings.helper";
import CustomPopover from "@/components/inputs/CustomPopover";
import TableActionButton from "@/components/inputs/TableActionButton";
import {
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ellipsisHClassName } from "@/constants/input.constants";
import { PERMISSIONS } from "@/constants/permission.constants";

export const useReviewReleaseColumns = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const permissions = user?.permissions ?? [];

  const canApprove = permissions.includes(PERMISSIONS.APPROVE_RELEASE);
  const canReject = permissions.includes(PERMISSIONS.REJECT_RELEASE);

  const reviewReleaseColumns = useMemo<ColumnDef<Release>[]>(
    () => [
      {
        header: "No",
        accessorKey: "no",
        cell: ({ row }) => row.index + 1,
      },
      {
        header: "Catalog Number",
        accessorKey: "catalogNumber",
      },
      {
        header: "Title",
        accessorKey: "title",
      },
      {
        header: "Submitted by",
        accessorKey: "createdBy",
        cell: ({ row }) =>
          row?.original?.createdBy?.name ||
          row?.original?.createdBy?.email ||
          "-",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <span className={getStatusBackgroundColor(row?.original?.status)}>
            {capitalizeString(row?.original?.status)}
          </span>
        ),
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: ({ row }) => capitalizeString(row?.original?.type),
      },
      {
        header: "Submitted",
        accessorKey: "updatedAt",
        cell: ({ row }) =>
          formatDate(row?.original?.updatedAt, "DD/MM/YYYY HH:mm"),
      },
      {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }: { row: Row<Release> }) => {
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
                  to={`/releases/${row?.original?.id}/review`}
                >
                  View release
                </TableActionButton>
                {canApprove && (
                  <TableActionButton
                    icon={faCircleCheck}
                    iconClassName="text-green-700 text-[12px]"
                    onClick={(e) => {
                      e.preventDefault();
                      if (row?.original?.id) {
                        dispatch(setSelectedRelease(row.original));
                        dispatch(setApproveReleaseModal(true));
                      }
                    }}
                  >
                    Approve
                  </TableActionButton>
                )}
                {canReject && (
                  <TableActionButton
                    icon={faCircleXmark}
                    iconClassName="text-red-700 text-[12px]"
                    onClick={(e) => {
                      e.preventDefault();
                      if (row?.original?.id) {
                        dispatch(setSelectedRelease(row.original));
                        dispatch(setRejectReleaseModal(true));
                      }
                    }}
                  >
                    Request changes
                  </TableActionButton>
                )}
              </menu>
            </CustomPopover>
          );
        },
      },
    ],
    [dispatch, canApprove, canReject]
  );

  return { reviewReleaseColumns };
};
