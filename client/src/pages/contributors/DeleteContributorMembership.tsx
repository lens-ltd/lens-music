import Button from "@/components/inputs/Button";
import Modal from "@/components/modals/Modal";
import { useDeleteContributorMembership } from "@/hooks/contributors/contributorMembership.hooks";
import {
  setDeleteContributorMembershipModal,
  setSelectedContributorMembership,
} from "@/state/features/contributorMembershipSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

const DeleteContributorMembership = () => {
  // STATE
  const dispatch = useAppDispatch();
  const { deleteContributorMembershipModal, selectedContributorMembership } =
    useAppSelector((state) => state.contributorMembership);

  // DELETE CONTRIBUTOR MEMBERSHIP
  const { deleteContributorMembership, isLoading, isSuccess, reset } =
    useDeleteContributorMembership();

  // CLOSE MODAL
  const closeModal = useCallback(() => {
    dispatch(setDeleteContributorMembershipModal(false));
    dispatch(setSelectedContributorMembership(undefined));
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      if (selectedContributorMembership?.id) {
        toast.success(
          `${selectedContributorMembership?.memberContributor?.displayName || selectedContributorMembership?.memberContributor?.name} has been removed successfully.`,
        );
      }
      reset();
      closeModal();
    }
  }, [isSuccess, selectedContributorMembership, reset, closeModal]);

  return (
    <Modal
      isOpen={deleteContributorMembershipModal}
      onClose={closeModal}
      heading={`Delete ${selectedContributorMembership?.memberContributor?.displayName || selectedContributorMembership?.memberContributor?.name}`}
      headingClassName="text-red-700"
    >
      <article className="w-full flex flex-col gap-4">
        <p>
          Are you sure you want to delete{" "}
          {selectedContributorMembership?.memberContributor?.displayName ||
            selectedContributorMembership?.memberContributor?.name}
          ? This action cannot be undone.
        </p>
        <Button
          danger
          className="self-end"
          onClick={(e) => {
            e.preventDefault();
            if (selectedContributorMembership?.id) {
              deleteContributorMembership({
                id: selectedContributorMembership?.id,
              });
            }
          }}
          isLoading={isLoading}
        >
          Delete
        </Button>
      </article>
    </Modal>
  );
};

export default DeleteContributorMembership;
