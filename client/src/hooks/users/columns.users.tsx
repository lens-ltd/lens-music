import CustomPopover from "@/components/inputs/CustomPopover";
import TableActionButton from "@/components/inputs/TableActionButton";
import { ellipsisHClassName } from "@/constants/input.constants";
import { PERMISSIONS } from "@/constants/permission.constants";
import {
  setAssignUserRoleModal,
  setSelectedUser,
} from "@/state/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { User } from "@/types/models/user.types";
import {
  capitalizeString,
  formatDate,
  getStatusBackgroundColor,
} from "@/utils/strings.helper";
import {
  faCircleInfo,
  faEllipsisH,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export const useUserColumns = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const canAssignRole = user?.permissions?.includes(PERMISSIONS.UPDATE_USER);

  const userColumns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => row.original.name || "—",
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: ({ row }) => row.original.email || "—",
      },
      {
        header: "Phone Number",
        accessorKey: "phoneNumber",
        cell: ({ row }) => row.original.phoneNumber || "—",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <span className={getStatusBackgroundColor(row.original?.status)}>
            {capitalizeString(row.original?.status)}
          </span>
        ),
      },
      {
        header: "Last updated",
        accessorKey: "updatedAt",
        cell: ({ row }) =>
          row.original.updatedAt
            ? formatDate(row.original?.updatedAt, "DD/MM/YYYY HH:mm")
            : "—",
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
                  icon={faCircleInfo}
                  to={`/users/${row?.original?.id}`}
                >
                  View details
                </TableActionButton>
                {canAssignRole && (
                  <TableActionButton
                    icon={faShieldAlt}
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(setSelectedUser(row?.original));
                      dispatch(setAssignUserRoleModal(true));
                    }}
                  >
                    Assign role
                  </TableActionButton>
                )}
              </menu>
            </CustomPopover>
          );
        },
      },
    ],
    [dispatch, canAssignRole],
  );

  return { userColumns };
};
