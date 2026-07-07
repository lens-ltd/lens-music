import Button from "@/components/inputs/Button";
import Modal from "@/components/modals/Modal";
import { InputErrorMessage } from "@/components/feedbacks/ErrorLabels";
import { useRejectRelease } from "@/hooks/releases/release-review.hooks";
import {
  setRejectReleaseModal,
  setSelectedRelease,
} from "@/state/features/releaseSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const RejectRelease = () => {
  const dispatch = useAppDispatch();
  const { rejectReleaseModal, selectedRelease } = useAppSelector(
    (state) => state.release,
  );

  const [reviewNotes, setReviewNotes] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  const { rejectRelease, isLoading, data, isSuccess, reset } =
    useRejectRelease();

  const closeModal = useCallback(() => {
    dispatch(setRejectReleaseModal(false));
    dispatch(setSelectedRelease(undefined));
    setReviewNotes("");
    setError(undefined);
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Changes requested successfully");
      reset();
      closeModal();
    }
  }, [isSuccess, data, reset, closeModal]);

  const handleSubmit = () => {
    if (!selectedRelease?.id) return;
    if (!reviewNotes.trim()) {
      setError("Please provide feedback for the submitter");
      return;
    }
    setError(undefined);
    rejectRelease({ id: selectedRelease.id, reviewNotes: reviewNotes.trim() });
  };

  return (
    <Modal
      isOpen={rejectReleaseModal}
      onClose={closeModal}
      heading={`Request changes on ${selectedRelease?.title ?? "release"}`}
    >
      <article className="w-full flex flex-col gap-4">
        <p className="text-sm text-[color:var(--lens-ink)]/70">
          Rejecting sends this release back to draft so the submitter can make
          changes. Your feedback is required and will be emailed to them.
        </p>
        <label className="flex flex-col gap-1">
          <span className="text-[12px] font-medium text-[color:var(--lens-ink)]">
            Feedback <span className="text-red-600">*</span>
          </span>
          <textarea
            value={reviewNotes}
            onChange={(e) => {
              setReviewNotes(e.target.value);
              if (error) setError(undefined);
            }}
            rows={4}
            placeholder="Explain what needs to change before this release can be approved"
            className="w-full rounded-md border border-secondary/30 bg-white p-3 text-sm outline-none focus:border-primary"
          />
        </label>
        {error && <InputErrorMessage message={error} />}
        <Button
          primary
          submit
          isLoading={isLoading}
          className="self-end"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          Request changes
        </Button>
      </article>
    </Modal>
  );
};

export default RejectRelease;
