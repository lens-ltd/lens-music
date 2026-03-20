import Button from "@/components/inputs/Button";
import Modal from "@/components/modals/Modal";
import { useDeleteContributor } from "@/hooks/contributors/contributor.hooks";
import { setDeleteContributorModal, setSelectedContributor } from "@/state/features/contributorSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

const DeleteContributor = () => {

    // STATE
    const dispatch = useAppDispatch();
    const { deleteContributorModal, selectedContributor } = useAppSelector((state) => state.contributor);

    // DELETE CONTRIBUTOR
    const { deleteContributor, isLoading, data, isSuccess, reset } = useDeleteContributor();

    // CLOSE MODAL
    const closeModal = useCallback(() => {
        dispatch(setDeleteContributorModal(false));
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
        <Modal isOpen={deleteContributorModal} onClose={closeModal} headingClassName="text-red-700" heading={`Delete ${selectedContributor?.displayName || selectedContributor?.name}`}>
            <article className="w-full flex flex-col gap-4">
                <p>Are you sure you want to delete {selectedContributor?.displayName || selectedContributor?.name}? This action cannot be undone.</p>
                <Button danger className="self-end" onClick={(e) => {
                    e.preventDefault();
                    if (selectedContributor?.id) {
                        deleteContributor({ id: selectedContributor?.id });
                    }
                }} isLoading={isLoading}>
                    Delete
                </Button>
            </article>
        </Modal>
    )
}

export default DeleteContributor;
