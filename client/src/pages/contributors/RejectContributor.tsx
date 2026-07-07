import Button from "@/components/inputs/Button";
import Modal from "@/components/modals/Modal";
import { useRejectContributor } from "@/hooks/contributors/contributor.hooks";
import {
  setRejectContributorModal,
  setSelectedContributor,
} from "@/state/features/contributorSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const RejectContributor = () => {
  const dispatch = useAppDispatch();
  const { rejectContributorModal, selectedContributor } = useAppSelector(
    (state) => state.contributor,
  );

  const [notes, setNotes] = useState("");

  const { rejectContributor, isLoading, data, isSuccess, reset } =
    useRejectContributor();

  const closeModal = useCallback(() => {
    dispatch(setRejectContributorModal(false));
    dispatch(setSelectedContributor(undefined));
    setNotes("");
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Contributor verification rejected");
      reset();
      closeModal();
    }
  }, [isSuccess, data, reset, closeModal]);

  return (
    <Modal
      isOpen={rejectContributorModal}
      onClose={closeModal}
      heading={`Reject ${
        selectedContributor?.displayName || selectedContributor?.name || ""
      }`}
    >
      <article className="w-full flex flex-col gap-4">
        <p className="text-sm text-[color:var(--lens-ink)]/70">
          This marks the contributor as not verified. You can optionally include
          a note explaining why.
        </p>
        <label className="flex flex-col gap-1">
          <span className="text-[12px] font-medium text-[color:var(--lens-ink)]">
            Note (optional)
          </span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Reason for rejecting verification"
            className="w-full rounded-md border border-secondary/30 bg-white p-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <Button
          primary
          submit
          isLoading={isLoading}
          className="self-end"
          onClick={(e) => {
            e.preventDefault();
            if (selectedContributor?.id) {
              rejectContributor({
                id: selectedContributor.id,
                notes: notes.trim() || undefined,
              });
            }
          }}
        >
          Reject verification
        </Button>
      </article>
    </Modal>
  );
};

export default RejectContributor;
