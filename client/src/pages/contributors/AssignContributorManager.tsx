import Button from "@/components/inputs/Button";
import Combobox from "@/components/inputs/Combobox";
import Modal from "@/components/modals/Modal";
import {
  useAssignContributorManager,
  useFetchContributorManagers,
} from "@/hooks/contributors/contributor.hooks";
import { useFetchUsers } from "@/hooks/users/users.hooks";
import {
  setAssignManagerModal,
} from "@/state/features/contributorSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const AssignContributorManager = () => {
  const dispatch = useAppDispatch();
  const { assignManagerModal, contributor, managersList } = useAppSelector(
    (state) => state.contributor,
  );
  const { usersList } = useAppSelector((state) => state.user);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const { fetchUsers, isFetching: usersLoading } = useFetchUsers();
  const { fetchManagers } = useFetchContributorManagers();
  const { assignManager, isLoading, data, isSuccess, isError, error, reset } =
    useAssignContributorManager();

  const closeModal = useCallback(() => {
    dispatch(setAssignManagerModal(false));
    setSelectedUserId("");
  }, [dispatch]);

  useEffect(() => {
    if (assignManagerModal) {
      fetchUsers({ page: 0, size: 100 });
    }
  }, [assignManagerModal, fetchUsers]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Manager assigned");
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
        "Failed to assign manager";
      toast.error(message);
      reset();
    }
  }, [isError, error, reset]);

  const assignedUserIds = useMemo(
    () => new Set(managersList.map((m) => m.userId)),
    [managersList],
  );

  const userOptions = useMemo(
    () =>
      (usersList || [])
        .filter((user) => user.id && !assignedUserIds.has(user.id))
        .map((user) => ({
          value: user.id,
          label: user.email
            ? `${user.name || "User"} (${user.email})`
            : user.name || user.id,
        })),
    [usersList, assignedUserIds],
  );

  return (
    <Modal
      isOpen={assignManagerModal}
      onClose={closeModal}
      heading="Assign manager"
    >
      <article className="w-full flex flex-col gap-4">
        <p className="text-[13px] text-[color:var(--lens-ink)]/70">
          Select a platform user who may manage{" "}
          <strong>
            {contributor?.displayName || contributor?.name || "this contributor"}
          </strong>
          . They still need the relevant contributor permissions.
        </p>
        <Combobox
          label="User"
          required
          placeholder="Select user..."
          options={userOptions}
          value={selectedUserId}
          onChange={setSelectedUserId}
          isLoading={usersLoading}
        />
        <Button
          primary
          submit
          className="self-end"
          isLoading={isLoading}
          disabled={!selectedUserId || !contributor?.id}
          onClick={(e) => {
            e.preventDefault();
            if (!contributor?.id || !selectedUserId) return;
            assignManager({ id: contributor.id, userId: selectedUserId });
          }}
        >
          Assign manager
        </Button>
      </article>
    </Modal>
  );
};

export default AssignContributorManager;
