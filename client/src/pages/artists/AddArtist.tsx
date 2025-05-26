import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/modals/Modal';
import { AppDispatch, RootState } from '../../state/store';
import { setAddArtistModal } from '../../state/features/artistSlice';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Input from '../../components/inputs/Input';
import Select from '../../components/inputs/Select';
import Button from '../../components/inputs/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useCreateArtistMutation } from '../../state/api/apiMutationSlice';
import Loader from '../../components/inputs/Loader';

const AddArtist = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { addArtistModal } = useSelector((state: RootState) => state.artist);
  const { labelsList } = useSelector((state: RootState) => state.label);

  // INITIALIZE CREATE ARTIST MUTATION
  const [
    createArtist,
    {
      data: artist,
      error: artistError,
      isLoading: artistIsLoading,
      isError: artistIsError,
      isSuccess: artistIsSuccess,
    },
  ] = useCreateArtistMutation();

  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    const formData = new FormData();

    formData.append('name', data.name);
    if (watch('avatar')) {
      formData.append('file', watch('avatar'));
    }
    formData.append('label_id', data?.label_id);

    createArtist({ formData });
  };

  return (
    <Modal
      isOpen={addArtistModal}
      onClose={() => {
        dispatch(setAddArtistModal(false));
      }}
    >
      <section className="flex flex-col gap-4 w-full">
        <h1 className="uppercase text-lg font-semibold">Add new artist</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full"
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Artist name is required' }}
            render={({ field }) => {
              return (
                <label className="flex w-full flex-col gap-1">
                  <Input
                    label="Name"
                    placeholder="Add artist name"
                    required
                    {...field}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {String(errors?.name?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => {
              return (
                <label className="flex w-full flex-col gap-1">
                  <Input
                    label="Profile photo"
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => {
                      field.onChange(e.target.files?.[0]);
                      setValue('avatar', e.target.files?.[0]);
                    }}
                  />
                  {watch('avatar') && (
                    <menu className="w-full flex gap-3 items-center justify-between my-2">
                      <p className="text-[14px]">{watch('avatar')?.name}</p>
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-white bg-red-600 p-2 text-[14px] rounded-full transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          setValue('avatar', undefined);
                        }}
                      />
                    </menu>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="label_id"
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Select
                    label="Label"
                    options={labelsList?.map((label) => {
                      return {
                        label: label?.name,
                        value: label?.id,
                      };
                    })}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                </label>
              );
            }}
          />
          <menu className="w-full flex items-center gap-3 justify-between">
            <Button
              onClick={(e) => {
                e.preventDefault();
                dispatch(setAddArtistModal(false));
              }}
            >
              Cancel
            </Button>
            <Button primary submit>
              {artistIsLoading ? <Loader /> : 'Submit'}
            </Button>
          </menu>
        </form>
      </section>
    </Modal>
  );
};

export default AddArtist;
