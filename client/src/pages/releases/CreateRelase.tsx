import Button from '@/components/inputs/Button';
import Combobox from '@/components/inputs/Combobox';
import Input from '@/components/inputs/Input';
import Modal from '@/components/modals/Modal';
import { useCreateRelease } from '@/hooks/releases/release.hooks';
import { setCreateReleaseModal } from '@/state/features/releaseSlice';
import { AppDispatch, RootState } from '@/state/store';
import { ReleaseType } from '@/types/models/release.types';
import { capitalizeString } from '@/utils/strings.helper';
import { useCallback, useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateRelase = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { createReleaseModal } = useSelector(
    (state: RootState) => state.release
  );

  // NAVIGATION
  const navigate = useNavigate();

  // REACT HOOK FORM
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  // CREATE RELEASE
  const { createRelease, isLoading, reset: createRelaseReset, data, isSuccess } = useCreateRelease();

  const closeModal = useCallback(() => {
    dispatch(setCreateReleaseModal(false));
    reset();
    createRelaseReset();
  }, [dispatch]);

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    createRelease({ title: data?.title, type: data?.type });
  };

  useEffect(() => {
    if (isSuccess) {
      createRelaseReset();
      if (data?.data?.id) {
        navigate(`/releases/${data?.data?.id}/wizard`);
      }
      closeModal();
    }
  }, [isSuccess, createRelaseReset, dispatch, closeModal, navigate, data]);

  return (
    <Modal
      isOpen={createReleaseModal}
      onClose={closeModal}
      heading="Add new Release"
      className="min-w-[60vw]"
    >
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="w-full grid grid-cols-2 gap-5 justify-between">
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Title is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    {...field}
                    placeholder="Enter release title"
                    label="Title"
                    required
                    errorMessage={errors?.title?.message}
                  />
                </label>
              );
            }}
          />
          <Controller
            name="type"
            control={control}
            rules={{ required: 'Please select the type' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Combobox
                    {...field}
                    placeholder="Please select the type"
                    label="Type"
                    required
                    options={Object.entries(ReleaseType).map(([key, value]) => ({
                      label: capitalizeString(key),
                      value: value,
                    }))}
                    errorMessage={errors?.type?.message}
                  />
                </label>
              );
            }}
          />
        </fieldset>
        <Button primary submit isLoading={isLoading} className='self-end'>
          Continue
        </Button>
      </form>
    </Modal>
  );
};

export default CreateRelase;
