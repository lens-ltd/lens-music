import Button from "@/components/inputs/Button";
import Modal from "@/components/modals/Modal";
import { useApproveRelease } from "@/hooks/releases/release-review.hooks";
import {
  setApproveReleaseModal,
  setSelectedRelease,
} from "@/state/features/releaseSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

const ApproveRelease = () => {
  const dispatch = useAppDispatch();
  const { approveReleaseModal, selectedRelease } = useAppSelector(
    (state) => state.release,
  );

  const { approveRelease, isLoading, data, isSuccess, reset } =
    useApproveRelease();

  const closeModal = useCallback(() => {
    dispatch(setApproveReleaseModal(false));
    dispatch(setSelectedRelease(undefined));
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Release approved successfully");
      reset();
      closeModal();
    }
  }, [isSuccess, data, reset, closeModal]);

  return (
    <Modal
      isOpen={approveReleaseModal}
      onClose={closeModal}
      heading={`Approve ${selectedRelease?.title ?? "release"}`}
    >
      <article className="w-full flex flex-col gap-4">
        <p className="text-sm text-[color:var(--lens-ink)]/70">
          Approving marks this release as ready for delivery. The submitter will
          be notified by email.
        </p>
        <Button
          primary
          submit
          isLoading={isLoading}
          className="self-end"
          onClick={(e) => {
            e.preventDefault();
            if (selectedRelease?.id) {
              approveRelease({ id: selectedRelease.id });
            }
          }}
        >
          Approve release
        </Button>
      </article>
    </Modal>
  );
};

export default ApproveRelease;
