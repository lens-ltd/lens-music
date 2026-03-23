import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { setCreateReleaseTrackModal } from "@/state/features/trackSlice";
import { useCallback, useEffect } from "react";
import Modal from "@/components/modals/Modal";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { useCreateTrack } from "@/hooks/tracks/track.hooks";
import Input from "@/components/inputs/Input";
import Button from "@/components/inputs/Button";
import { useNavigate } from "react-router-dom";

const CreateReleaseTrack = () => {
  // STATE
  const dispatch = useAppDispatch();
  const { createReleaseTrackModal } = useAppSelector((state) => state.track);
  const { release } = useAppSelector((state) => state.release);

  // NAVIGATION
  const navigate = useNavigate();

  // REACT HOOK FORM
  const { control, handleSubmit, reset } = useForm();

  // CREATE TRACK
  const {
    createTrack,
    isLoading,
    reset: createTrackReset,
    data,
    isSuccess,
  } = useCreateTrack();

  const closeModal = useCallback(() => {
    dispatch(setCreateReleaseTrackModal(false));
    reset();
    createTrackReset();
  }, [dispatch, reset, createTrackReset]);

  // HANDLE FORM SUBMISSION
  const onSubmit = handleSubmit((data: FieldValues) => {
    createTrack({
      title: data?.title,
      releaseId: release?.id,
      titleVersion: data?.titleVersion,
    });
  });

  useEffect(() => {
    if (isSuccess) {
      createTrackReset();
      if (data?.data?.id) {
        navigate(`/releases/${release?.id}/manage-tracks/${data?.data?.id}`);
      }
      closeModal();
    }
  }, [
    isSuccess,
    createTrackReset,
    closeModal,
    navigate,
    release?.id,
    data?.data?.id,
  ]);

  return (
    <Modal
      heading={`Add track to ${release?.title}`}
      isOpen={createReleaseTrackModal}
      onClose={closeModal}
    >
      <form className="w-full flex flex-col gap-4" onSubmit={onSubmit}>
        <fieldset className="w-full grid grid-cols-2 gap-5 justify-between">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter track title"
                label="Title"
                required
              />
            )}
          />
          <Controller
            name="titleVersion"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter track title version"
                label="Title Version (Optional)"
              />
            )}
          />
        </fieldset>
        <Button primary submit isLoading={isLoading} className="self-end">
          Continue
        </Button>
      </form>
    </Modal>
  );
};

export default CreateReleaseTrack;
