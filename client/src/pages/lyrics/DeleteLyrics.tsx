import Button from "@/components/inputs/Button";
import Modal from "@/components/modals/Modal";
import { useDeleteLyrics } from "@/hooks/lyrics/lyrics.hooks";
import {
  setDeleteLyricsModal,
  setSelectedLyrics,
} from "@/state/features/lyricSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

const DeleteLyrics = () => {
  // STATE VARIABLES
  const dispatch = useAppDispatch();
  const { deleteLyricsModal, selectedLyrics } = useAppSelector(
    (state) => state.lyric,
  );

  // DELETE LYRICS
  const { deleteLyrics, isLoading, data, isSuccess, reset } = useDeleteLyrics();

  // CLOSE MODAL
  const closeModal = useCallback(() => {
    dispatch(setDeleteLyricsModal(false));
    dispatch(setSelectedLyrics(undefined));
    reset();
  }, [dispatch, reset]);

  useEffect(() => {
    if (isSuccess) {
      if (data?.message && selectedLyrics?.id) {
        toast.success(data?.message);
      }
      reset();
      closeModal();
    }
  }, [isSuccess, data, reset, closeModal, selectedLyrics]);

  return (
    <Modal
      isOpen={deleteLyricsModal}
      onClose={closeModal}
      heading={`Delete ${selectedLyrics?.language}`}
      headingClassName="text-red-700"
    >
      <article className="w-full flex flex-col gap-4">
        <p className="text-[12px] text-[color:var(--lens-ink)]/75">
          Are you sure you want to delete {selectedLyrics?.language}? This
          action cannot be undone.
        </p>
        <Button
          danger
          className="self-end"
          onClick={(e) => {
            e.preventDefault();
            if (selectedLyrics?.id) {
              deleteLyrics({ id: selectedLyrics?.id });
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

export default DeleteLyrics;
