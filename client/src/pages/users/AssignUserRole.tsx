import Button from "@/components/inputs/Button";
import Combobox from "@/components/inputs/Combobox";
import Modal from "@/components/modals/Modal";
import { useFetchRoles } from "@/hooks/roles/roles.hooks";
import { useAssignUserRole } from "@/hooks/users/userMutations.hooks";
import {
  setAssignUserRoleModal,
  setSelectedUser,
} from "@/state/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const AssignUserRole = () => {
  const dispatch = useAppDispatch();
  const { assignUserRoleModal, selectedUser } = useAppSelector(
    (state) => state.user,
  );
  const { rolesList } = useAppSelector((state) => state.role);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  const { fetchRoles, isFetching: rolesLoading } = useFetchRoles();
  const { assignUserRole, isLoading, data, isSuccess, isError, error, reset } =
    useAssignUserRole();

  const closeModal = useCallback(() => {
    dispatch(setAssignUserRoleModal(false));
    dispatch(setSelectedUser(undefined));
    setSelectedRoleId("");
  }, [dispatch]);

  useEffect(() => {
    if (assignUserRoleModal) {
      fetchRoles({ page: 0, size: 100 });
    }
  }, [assignUserRoleModal, fetchRoles]);

  // Best-effort preselect: users only carry roleName, so match by name.
  useEffect(() => {
    if (assignUserRoleModal && selectedUser?.roleName) {
      const currentRole = rolesList.find(
        (role) => role.name === selectedUser.roleName,
      );
      if (currentRole) {
        setSelectedRoleId(currentRole.id);
      }
    }
  }, [assignUserRoleModal, selectedUser?.roleName, rolesList]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Role assigned successfully");
      reset();
      closeModal();
    }
  }, [isSuccess, data, reset, closeModal]);

  useEffect(() => {
    if (isError) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to assign role";
      toast.error(message);
      reset();
    }
  }, [isError, error, reset]);

  const roleOptions = useMemo(
    () =>
      (rolesList || []).map((role) => ({
        value: role.id,
        label: role.name,
      })),
    [rolesList],
  );

  return (
    <Modal
      isOpen={assignUserRoleModal}
      onClose={closeModal}
      heading="Assign role"
    >
      <article className="w-full flex flex-col gap-4">
        <p className="text-[13px] text-[color:var(--lens-ink)]/70">
          Select a role to assign to{" "}
          <strong>
            {selectedUser?.name || selectedUser?.email || "this user"}
          </strong>
          . Their permissions update immediately.
        </p>
        <Combobox
          label="Role"
          required
          placeholder="Select role..."
          options={roleOptions}
          value={selectedRoleId}
          onChange={setSelectedRoleId}
          isLoading={rolesLoading}
        />
        <Button
          primary
          submit
          className="self-end"
          isLoading={isLoading}
          disabled={!selectedRoleId || !selectedUser?.id}
          onClick={(e) => {
            e.preventDefault();
            if (!selectedUser?.id || !selectedRoleId) return;
            assignUserRole({ id: selectedUser.id, roleId: selectedRoleId });
          }}
        >
          Assign role
        </Button>
      </article>
    </Modal>
  );
};

export default AssignUserRole;
