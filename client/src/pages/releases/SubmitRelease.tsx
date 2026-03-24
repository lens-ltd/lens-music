import Button from "@/components/inputs/Button";
import Modal from "@/components/modals/Modal";
import { useSubmitRelease } from "@/hooks/releases/release.hooks";
import {
  setSelectedRelease,
  setSubmitReleaseModal,
} from "@/state/features/releaseSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const getMutationErrorMessage = (error: unknown) => {
  if (typeof error !== "object" || !error) return "Failed to submit release.";

  const errorWithData = error as {
    data?: { message?: string } | string;
    error?: string;
  };

  if (typeof errorWithData.data === "string") return errorWithData.data;
  if (typeof errorWithData.data?.message === "string") {
    return errorWithData.data.message;
  }
  if (typeof errorWithData.error === "string") return errorWithData.error;

  return "Failed to submit release.";
};

const SubmitRelease = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { release, selectedRelease, submitReleaseModal } = useAppSelector(
    (state) => state.release,
  );
  const activeRelease = selectedRelease ?? release;
  const {
    submitRelease,
    isLoading,
    data,
    isSuccess,
    isError,
    error,
    reset,
  } = useSubmitRelease();

  const closeModal = useCallback(() => {
    dispatch(setSubmitReleaseModal(false));
    dispatch(setSelectedRelease(undefined));
    reset();
  }, [dispatch, reset]);

  useEffect(() => {
    if (isSuccess) {
      if (data?.data?.valid) {
        toast.success(data?.message || "Release submitted for review.");
        closeModal();
        navigate("/releases");
        return;
      }

      const issueCount = data?.data?.errors?.length ?? 0;
      toast.error(
        issueCount > 0
          ? `Submission failed. ${issueCount} validation issue${issueCount === 1 ? "" : "s"} found.`
          : "Submission failed.",
      );
    }
  }, [isSuccess, data, closeModal, navigate]);

  useEffect(() => {
    if (isError && error) {
      toast.error(getMutationErrorMessage(error));
    }
  }, [isError, error]);

  return (
    <Modal
      isOpen={submitReleaseModal}
      onClose={closeModal}
      heading={`Submit ${activeRelease?.title ?? "release"}`}
      className="sm:min-w-[540px]"
    >
      <article className="flex w-full flex-col gap-4">
        <p className="text-[12px] text-[color:var(--lens-ink)]/75">
          Submit this validated release for review. Submission will run the
          release validation checks again before changing its status to review.
        </p>
        <menu className="flex items-center justify-end gap-3">
          <Button
            onClick={(event) => {
              event.preventDefault();
              closeModal();
            }}
          >
            Cancel
          </Button>
          <Button
            primary
            isLoading={isLoading}
            onClick={(event) => {
              event.preventDefault();
              if (activeRelease?.id) {
                submitRelease({ id: activeRelease.id });
              }
            }}
          >
            Submit for Review
          </Button>
        </menu>
      </article>
    </Modal>
  );
};

export default SubmitRelease;
