import Button from "@/components/inputs/Button";
import Modal from "@/components/modals/Modal";
import { useDeleteRelease } from "@/hooks/releases/release.hooks";
import {
  setDeleteReleaseModal,
  setSelectedRelease,
} from "@/state/features/releaseSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

const DeleteRelease = () => {
  const dispatch = useAppDispatch();
  const { deleteReleaseModal, selectedRelease } = useAppSelector(
    (state) => state.release,
  );

  const { deleteRelease, isLoading, data, isSuccess, reset } =
    useDeleteRelease();

  const closeModal = useCallback(() => {
    dispatch(setDeleteReleaseModal(false));
    dispatch(setSelectedRelease(undefined));
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
      isOpen={deleteReleaseModal}
      onClose={closeModal}
      headingClassName="text-red-700"
      heading={`Delete ${selectedRelease?.title}`}
    >
      <article className="w-full flex flex-col gap-4">
        <p>
          Are you sure you want to delete {selectedRelease?.title}? This action
          cannot be undone.
        </p>
        <Button
          danger
          className="self-end"
          onClick={(e) => {
            e.preventDefault();
            if (selectedRelease?.id) {
              deleteRelease({ id: selectedRelease?.id });
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

export default DeleteRelease;
