import Button from "@/components/inputs/Button";
import Modal from "@/components/modals/Modal";
import { useDeleteRole } from "@/hooks/roles/roleMutations.hooks";
import { setDeleteRoleModal, setSelectedRole } from "@/state/features/roleSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { useCallback } from "react";

interface DeleteRoleProps {
  onDeleted?: () => void;
}

const DeleteRole = ({ onDeleted }: DeleteRoleProps) => {
  const dispatch = useAppDispatch();
  const { deleteRoleModal, selectedRole } = useAppSelector(
    (state) => state.role,
  );
  const { deleteRole, isDeleting } = useDeleteRole();

  const closeModal = useCallback(() => {
    dispatch(setDeleteRoleModal(false));
    dispatch(setSelectedRole(undefined));
  }, [dispatch]);

  const handleDelete = async () => {
    if (!selectedRole?.id) {
      return;
    }

    const success = await deleteRole(selectedRole.id);
    if (success) {
      onDeleted?.();
      closeModal();
    }
  };

  return (
    <Modal
      isOpen={deleteRoleModal}
      onClose={closeModal}
      headingClassName="text-red-700"
      heading={`Delete ${selectedRole?.name || "role"}`}
    >
      <article className="flex w-full flex-col gap-4">
        <p className="text-[13px] leading-6 text-[color:var(--lens-ink)]/70">
          Delete {selectedRole?.name || "this role"}? People assigned to this
          role may lose access tied to its permissions. This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button type="button" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            danger
            type="button"
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
            isLoading={isDeleting}
            disabled={isDeleting}
          >
            Delete role
          </Button>
        </div>
      </article>
    </Modal>
  );
};

export default DeleteRole;
