import { useAssignUserRoleMutation } from "@/state/api/apiMutationSlice";

// ASSIGN USER ROLE
export const useAssignUserRole = () => {
  const [assignUserRole, { isLoading, data, isSuccess, isError, error, reset }] =
    useAssignUserRoleMutation();

  return { assignUserRole, isLoading, data, isSuccess, isError, error, reset };
};
