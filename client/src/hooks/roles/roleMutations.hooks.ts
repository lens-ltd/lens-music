import { toast } from "sonner";
import {
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "@/state/api/apiMutationSlice";
import { useLazyFetchRolesQuery } from "@/state/api/apiQuerySlice";

export const useCreateRole = () => {
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [fetchRoles] = useLazyFetchRolesQuery();

  const handleCreateRole = async (data: {
    name: string;
    description?: string;
  }) => {
    try {
      await createRole(data).unwrap();
      toast.success("Role created successfully");
      await fetchRoles({ page: 0, size: 10 });
      return true;
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to create role";
      toast.error(message);
      return false;
    }
  };

  return { createRole: handleCreateRole, isCreating };
};

export const useUpdateRole = () => {
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [fetchRoles] = useLazyFetchRolesQuery();

  const handleUpdateRole = async (id: string, data: {
    name?: string;
    description?: string;
  }) => {
    try {
      await updateRole({ id, body: data }).unwrap();
      toast.success("Role updated successfully");
      await fetchRoles({ page: 0, size: 10 });
      return true;
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to update role";
      toast.error(message);
      return false;
    }
  };

  return { updateRole: handleUpdateRole, isUpdating };
};

export const useDeleteRole = () => {
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();
  const [fetchRoles] = useLazyFetchRolesQuery();

  const handleDeleteRole = async (id: string) => {
    try {
      await deleteRole(id).unwrap();
      toast.success("Role deleted successfully");
      await fetchRoles({ page: 0, size: 10 });
      return true;
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to delete role";
      toast.error(message);
      return false;
    }
  };

  return { deleteRole: handleDeleteRole, isDeleting };
};
