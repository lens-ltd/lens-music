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
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

import { LuEllipsis, LuInfo, LuShield } from 'react-icons/lu';
import { formatPhone } from "@/utils/phone.helper";

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
        cell: ({ row }) => formatPhone(row.original.phoneNumber) || "—",
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
                <button type="button" className={ellipsisHClassName} aria-label="More actions"><LuEllipsis className="size-4" aria-hidden="true" /></button>
              }
            >
              <menu className="m-0 flex w-full flex-col gap-0.5 p-0">
                <TableActionButton
                  icon={LuInfo}
                  to={`/users/${row?.original?.id}`}
                >
                  View details
                </TableActionButton>
                {canAssignRole && (
                  <TableActionButton
                    icon={LuShield}
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
