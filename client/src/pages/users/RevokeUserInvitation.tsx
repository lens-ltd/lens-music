import Button from "@/components/inputs/Button";
import Modal from "@/components/modals/Modal";
import {
  setRevokeInvitationModal,
  setSelectedUserInvitation,
} from "@/state/features/userInvitationSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { useCallback } from "react";

interface RevokeUserInvitationProps {
  isRevoking: boolean;
  onConfirm: (id: string) => Promise<boolean | void> | boolean | void;
}

const RevokeUserInvitation = ({
  isRevoking,
  onConfirm,
}: RevokeUserInvitationProps) => {
  const dispatch = useAppDispatch();
  const { revokeInvitationModal, selectedUserInvitation } = useAppSelector(
    (state) => state.userInvitation,
  );

  const closeModal = useCallback(() => {
    dispatch(setRevokeInvitationModal(false));
    dispatch(setSelectedUserInvitation(undefined));
  }, [dispatch]);

  const handleConfirm = async () => {
    if (!selectedUserInvitation?.id) {
      return;
    }

    const success = await onConfirm(selectedUserInvitation.id);
    if (success !== false) {
      closeModal();
    }
  };

  return (
    <Modal
      isOpen={revokeInvitationModal}
      onClose={closeModal}
      headingClassName="text-red-700"
      heading="Revoke invitation"
    >
      <article className="flex w-full flex-col gap-4">
        <p className="text-[13px] leading-6 text-[color:var(--lens-ink)]/70">
          Revoke the pending invitation for{" "}
          <span className="font-medium text-[color:var(--lens-ink)]">
            {selectedUserInvitation?.email || "this user"}
          </span>
          ? They will no longer be able to use this invitation link.
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
              void handleConfirm();
            }}
            isLoading={isRevoking}
            disabled={isRevoking}
          >
            Revoke invitation
          </Button>
        </div>
      </article>
    </Modal>
  );
};

export default RevokeUserInvitation;
