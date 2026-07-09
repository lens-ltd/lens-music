import CustomPopover from "@/components/inputs/CustomPopover";
import TableActionButton from "@/components/inputs/TableActionButton";
import { ellipsisHClassName } from "@/constants/input.constants";
import { setDeleteRoleModal, setSelectedRole } from "@/state/features/roleSlice";
import { useAppDispatch } from "@/state/hooks";
import { Role } from "@/types/models/role.types";
import { formatDate } from "@/utils/strings.helper";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import {
  faCircleInfo,
  faTrash,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export const useRoleColumns = () => {
  const dispatch = useAppDispatch();

  const roleColumns = useMemo<ColumnDef<Role>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => row.original.name || "—",
      },
      {
        header: "Description",
        accessorKey: "description",
        cell: ({ row }) => row.original.description || "—",
      },
      {
        header: "Permissions",
        accessorKey: "permissions",
        cell: ({ row }) => {
          const permissions = row.original.permissions || [];
          const count = permissions.length;
          return count > 0 ? `${count} permission${count !== 1 ? 's' : ''}` : "—";
        },
      },
      {
        header: "Created",
        accessorKey: "createdAt",
        cell: ({ row }) =>
          row.original.createdAt
            ? formatDate(row.original.createdAt, "DD/MM/YYYY HH:mm")
            : "—",
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
                  to={`/roles/${row?.original?.id}`}
                >
                  View details
                </TableActionButton>
                <TableActionButton
                  icon={faPenToSquare}
                  to={`/roles/${row?.original?.id}/edit`}
                >
                  Edit role
                </TableActionButton>
                <TableActionButton
                  icon={faTrash}
                  iconClassName="text-red-700 text-[12px]"
                  onClick={(e) => {
                    e.preventDefault();
                    if (row?.original?.id) {
                      dispatch(setSelectedRole(row.original));
                      dispatch(setDeleteRoleModal(true));
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
    [dispatch],
  );

  return { roleColumns };
};
