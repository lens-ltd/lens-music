import Button from "@/components/inputs/Button";
import Modal from "@/components/modals/Modal";
import {
  useFetchContributorManagers,
  useUnassignContributorManager,
} from "@/hooks/contributors/contributor.hooks";
import {
  setSelectedManager,
  setUnassignManagerModal,
} from "@/state/features/contributorSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

const UnassignContributorManager = () => {
  const dispatch = useAppDispatch();
  const { unassignManagerModal, selectedManager, contributor } = useAppSelector(
    (state) => state.contributor,
  );
  const { fetchManagers } = useFetchContributorManagers();
  const {
    unassignManager,
    isLoading,
    data,
    isSuccess,
    isError,
    error,
    reset,
  } = useUnassignContributorManager();

  const closeModal = useCallback(() => {
    dispatch(setUnassignManagerModal(false));
    dispatch(setSelectedManager(undefined));
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Manager unassigned");
      if (contributor?.id) {
        fetchManagers({ id: contributor.id });
      }
      reset();
      closeModal();
    }
  }, [isSuccess, data, reset, closeModal, contributor?.id, fetchManagers]);

  useEffect(() => {
    if (isError) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to unassign manager";
      toast.error(message);
      reset();
    }
  }, [isError, error, reset]);

  const managerLabel =
    selectedManager?.user?.name ||
    selectedManager?.user?.email ||
    "this user";

  return (
    <Modal
      isOpen={unassignManagerModal}
      onClose={closeModal}
      headingClassName="text-red-700"
      heading={`Remove manager`}
    >
      <article className="w-full flex flex-col gap-4">
        <p>
          Remove <strong>{managerLabel}</strong> as a manager of{" "}
          {contributor?.displayName || contributor?.name || "this contributor"}?
          They will no longer be able to update, delete, or verify this record
          (unless they have admin assign rights).
        </p>
        <Button
          danger
          className="self-end"
          isLoading={isLoading}
          onClick={(e) => {
            e.preventDefault();
            if (contributor?.id && selectedManager?.userId) {
              unassignManager({
                id: contributor.id,
                userId: selectedManager.userId,
              });
            }
          }}
        >
          Remove manager
        </Button>
      </article>
    </Modal>
  );
};

export default UnassignContributorManager;
