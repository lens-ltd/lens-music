import CustomPopover from "@/components/inputs/CustomPopover";
import TableActionButton from "@/components/inputs/TableActionButton";
import { ellipsisHClassName } from "@/constants/input.constants";
import { Role } from "@/types/models/role.types";
import { formatDate } from "@/utils/strings.helper";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { faPencil, faTrash } from "@fortawesome/free-regular-svg-icons";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

interface UseRoleColumnsProps {
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  isEditing?: boolean;
}

export const useRoleColumns = ({
  onView,
  onEdit,
  onDelete,
  isDeleting = false,
  isEditing = false,
}: UseRoleColumnsProps = {}) => {
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
                {onView && (
                  <TableActionButton
                    icon={faCircleInfo}
                    onClick={() => onView(row?.original?.id)}
                  >
                    View details
                  </TableActionButton>
                )}
                {onEdit && (
                  <TableActionButton
                    icon={faPencil}
                    onClick={() => onEdit(row?.original?.id)}
                  >
                    Edit
                  </TableActionButton>
                )}
                {onDelete && (
                  <TableActionButton
                    icon={faTrash}
                    onClick={() => onDelete(row?.original?.id)}
                    className="text-red-600 hover:bg-red-50"
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
    [onView, onEdit, onDelete],
  );

  return { roleColumns };
};