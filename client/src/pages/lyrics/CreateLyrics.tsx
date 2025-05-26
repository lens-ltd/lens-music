import store from 'store';
import { InputErrorMessage } from '@/components/feedbacks/ErrorLabels';
import Button from '@/components/inputs/Button';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import Input from '@/components/inputs/Input';
import TextArea from '@/components/inputs/TextArea';
import { Heading } from '@/components/text/Headings';
import UserLayout from '@/containers/UserLayout';
import { useValidateLyrics } from '@/hooks/lyrics/lyrics.hooks';
import { setLyricsGuideLinesModal } from '@/state/features/lyricSlice';
import { AppDispatch } from '@/state/store';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const CreateLyrics = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // NAVIGATION
  const navigate = useNavigate();

  // HANDLE SUBMIT
  const onSubmit = (data: FieldValues) => {
    const formattedLyrics: { title: string; content: string } = {
      title: data.title,
      content: data.content
        .split('\n')
        .map((line: string) =>
          line.length > 70 ? line.slice(0, 70) + '\n' + line.slice(70) : line
        )
        .join('\n'),
    };
    store.set('lyrics', JSON.stringify(formattedLyrics));
    navigate('/lyrics/sync');
  };

  // VALIDATE LYRICS
  const { errors: validateErrors, validateLyrics } = useValidateLyrics();

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <nav className="w-full flex items-center gap-3 justify-center">
          <ul className="flex items-center gap-3">
            <Heading>Create lyrics</Heading>
            <CustomTooltip label="Lyrics guidelines">
              <FontAwesomeIcon
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setLyricsGuideLinesModal(true));
                }}
                icon={faCircleInfo}
                className="text-primary cursor-pointer"
              />
            </CustomTooltip>
          </ul>
        </nav>
        <form
          className="w-[80%] mx-auto flex flex-col gap-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="w-full flex flex-col gap-2">
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    {...field}
                    placeholder="Enter the title"
                    label="Title"
                  />
                  {errors.title && (
                    <InputErrorMessage message={errors.title.message} />
                  )}
                </label>
              )}
            />
            <Controller
              name="content"
              control={control}
              rules={{ required: 'Content is required' }}
              render={({ field }) => (
                <label className="w-full flex flex-col gap-1">
                  <TextArea
                    resize
                    {...field}
                    placeholder="Enter the content"
                    label="Content"
                    onChange={(e) => {
                      field.onChange(e);
                      validateLyrics(e.target.value);
                    }}
                  />
                  {errors.content && (
                    <InputErrorMessage message={errors.content.message} />
                  )}
                </label>
              )}
            />
          </fieldset>
          {validateErrors?.length > 0 && (
            <ul className="w-full flex flex-col gap-1">
              {validateErrors.map((error, index) => (
                <li key={index} className="text-red-500">
                  {error}
                </li>
              ))}
            </ul>
          )}
          <menu className="w-full flex items-center gap-2 justify-end">
            <Button primary submit>
              Create
            </Button>
          </menu>
        </form>
      </main>
    </UserLayout>
  );
};

export default CreateLyrics;
