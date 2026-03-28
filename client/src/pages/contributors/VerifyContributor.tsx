import Button from "@/components/inputs/Button";
import Modal from "@/components/modals/Modal";
import { useVerifyContributor } from "@/hooks/contributors/contributor.hooks";
import {
  setSelectedContributor,
  setVerifyContributorModal,
} from "@/state/features/contributorSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

const VerifyContributor = () => {
  // STATE
  const dispatch = useAppDispatch();
  const { verifyContributorModal, selectedContributor } = useAppSelector(
    (state) => state.contributor,
  );

  // VERIFY CONTRIBUTOR
  const { verifyContributor, isLoading, data, isSuccess, reset } =
    useVerifyContributor();

  // CLOSE MODAL
  const closeModal = useCallback(() => {
    dispatch(setVerifyContributorModal(false));
    dispatch(setSelectedContributor(undefined));
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      if (data?.message) {
        toast.success(data?.message);
      }
      reset();
      closeModal();
    }
  }, [isSuccess, data, reset, closeModal]);

  return (
    <Modal
      isOpen={verifyContributorModal}
      onClose={closeModal}
      heading={`Verify ${selectedContributor?.displayName || selectedContributor?.name}`}
    >
      <article className="w-full flex flex-col gap-4">
        <p>
          Are you sure you want to verify{" "}
          {selectedContributor?.displayName || selectedContributor?.name}? The
          verification status will be dropped when the contributor is updated.
        </p>
        <Button
          primary
          submit
          isLoading={isLoading}
          className="self-end"
          onClick={(e) => {
            e.preventDefault();
            if (selectedContributor?.id) {
              verifyContributor({ id: selectedContributor?.id });
            }
          }}
        >
          Verify
        </Button>
      </article>
    </Modal>
  );
};

export default VerifyContributor;
