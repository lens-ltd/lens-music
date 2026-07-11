import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { setCreateReleaseTrackModal } from "@/state/features/trackSlice";
import { useCallback, useEffect } from "react";
import Modal from "@/components/modals/Modal";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { useCreateTrack } from "@/hooks/tracks/track.hooks";
import { useCreateTrackRightsController } from "@/hooks/tracks/track-rights-controllers.hooks";
import { TrackRightType } from "@/types/models/trackRightsController.types";
import { COUNTRIES_LIST } from "@/constants/countries.constants";
import Input from "@/components/inputs/Input";
import Button from "@/components/inputs/Button";
import { useNavigate } from "react-router-dom";

const CreateReleaseTrack = () => {
  // STATE
  const dispatch = useAppDispatch();
  const { createReleaseTrackModal } = useAppSelector((state) => state.track);
  const { release } = useAppSelector((state) => state.release);
  const user = useAppSelector((state) => state.auth.user);

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

  // AUTO-ATTACH DEFAULT RIGHTS CONTROLLER
  const { createTrackRightsController } = useCreateTrackRightsController();

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
    if (!isSuccess) return;

    const trackId = data?.data?.id;
    if (trackId) {
      // Auto-attach a default "making available" rights controller so the track
      // satisfies release validation out of the box. Fire-and-forget: the
      // mutation completes even after this modal unmounts, and users can still
      // edit/add controllers on the track manage page.
      const controllerName = user?.name || release?.title || "Rights Holder";
      const territories =
        release?.territories && release.territories.length > 0
          ? release.territories
          : COUNTRIES_LIST.map((country) => country.code);

      void createTrackRightsController({
        trackId,
        body: {
          controllerName,
          rightType: TrackRightType.MAKING_AVAILABLE_RIGHT,
          territories,
        },
      })
        .unwrap()
        .catch(() => {
          // Best-effort; the user can add controllers manually if this fails.
        });

      navigate(`/releases/${release?.id}/manage-tracks/${trackId}`);
    }

    createTrackReset();
    closeModal();
  }, [
    isSuccess,
    createTrackReset,
    closeModal,
    navigate,
    release?.id,
    release?.title,
    release?.territories,
    user?.name,
    createTrackRightsController,
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
