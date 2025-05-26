import { InputErrorMessage } from '@/components/feedbacks/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Select from '@/components/inputs/Select';
import Modal from '@/components/modals/Modal';
import { useFetchLabels } from '@/hooks/labels/label.hooks';
import { useGetYearsList } from '@/hooks/releases/release.hooks';
import { setCreateReleaseModal } from '@/state/features/releaseSlice';
import { AppDispatch, RootState } from '@/state/store';
import moment from 'moment';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const CreateRelase = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { createReleaseModal } = useSelector(
    (state: RootState) => state.release
  );

  // LABELS
  const { labelsIsFetching, labelsList, labelsIsSuccess } = useFetchLabels({
    isOpen: createReleaseModal,
    size: 100,
  });

  // REACT HOOK FORM
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };

  // PRODUCTION YEARS
  const productionYears = useGetYearsList();

  return (
    <Modal
      isOpen={createReleaseModal}
      onClose={() => {
        dispatch(setCreateReleaseModal(false));
      }}
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
                  />
                  {errors.title && (
                    <InputErrorMessage message={errors?.title?.message} />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="releaseDate"
            control={control}
            rules={{ required: 'Release date is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    {...field}
                    type="date"
                    label="Digital Release date"
                    required
                    fromDate={moment().add(7, 'days').toDate()}
                  />
                  {errors?.releaseDate && (
                    <InputErrorMessage message={errors?.releaseDate?.message} />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="productionYear"
            control={control}
            rules={{ required: 'Select production year' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Select
                    {...field}
                    label={'Production Year'}
                    required
                    options={productionYears?.map((year) => {
                      return {
                        label: String(year),
                        value: String(year),
                      };
                    })}
                  />
                  {errors?.productionYear && (
                    <InputErrorMessage
                      message={errors?.productionYear?.message}
                    />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="labelId"
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Select
                    {...field}
                    label="Label"
                    placeholder={
                      labelsIsFetching ? `Loading labels...` : `Select label`
                    }
                    required
                    options={
                      labelsIsSuccess
                        ? labelsList?.map((label) => {
                            return {
                              label: label.name,
                              value: label.id,
                            };
                          })
                        : []
                    }
                  />
                  {errors?.labelId && (
                    <InputErrorMessage message={errors?.labelId?.message} />
                  )}
                </label>
              );
            }}
          />
        </fieldset>
        <menu className="w-full flex items-center gap-3 justify-between">
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(setCreateReleaseModal(false));
            }}
          >
            Cancel
          </Button>
          <Button primary submit>
            Continue
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default CreateRelase;
