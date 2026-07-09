import Button from "@/components/inputs/Button";
import Modal from "@/components/modals/Modal";
import {
  setDeclineInvitationModal,
  setSelectedUserInvitation,
} from "@/state/features/userInvitationSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { useCallback } from "react";

interface DeclineUserInvitationProps {
  isDeclining: boolean;
  onConfirm: (id: string) => Promise<boolean | void> | boolean | void;
}

const DeclineUserInvitation = ({
  isDeclining,
  onConfirm,
}: DeclineUserInvitationProps) => {
  const dispatch = useAppDispatch();
  const { declineInvitationModal, selectedUserInvitation } = useAppSelector(
    (state) => state.userInvitation,
  );

  const closeModal = useCallback(() => {
    dispatch(setDeclineInvitationModal(false));
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
      isOpen={declineInvitationModal}
      onClose={closeModal}
      headingClassName="text-red-700"
      heading="Decline request"
    >
      <article className="flex w-full flex-col gap-4">
        <p className="text-[13px] leading-6 text-[color:var(--lens-ink)]/70">
          Decline the access request from{" "}
          <span className="font-medium text-[color:var(--lens-ink)]">
            {selectedUserInvitation?.email || "this user"}
          </span>
          ? This will remove the request from the approval queue.
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
            isLoading={isDeclining}
            disabled={isDeclining}
          >
            Decline request
          </Button>
        </div>
      </article>
    </Modal>
  );
};

export default DeclineUserInvitation;
