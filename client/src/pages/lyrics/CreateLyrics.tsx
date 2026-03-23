import { InputErrorMessage } from '@/components/feedbacks/ErrorLabels';
import Button from '@/components/inputs/Button';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import Input from '@/components/inputs/Input';
import TextArea from '@/components/inputs/TextArea';
import { Heading, RelaxedHeading } from '@/components/text/Headings';
import UserLayout from '@/containers/UserLayout';
import { useValidateLyrics } from '@/hooks/lyrics/lyrics.hooks';
import { useGetTrack } from '@/hooks/tracks/track.hooks';
import { setLyricsGuideLinesModal } from '@/state/features/lyricSlice';
import { useCreateLyricsMutation } from '@/state/api/apiMutationSlice';
import { AppDispatch } from '@/state/store';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEvent, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

type CreateLyricsFormValues = {
  trackId: string;
  language: string;
  content: string;
};

const defaultValues: CreateLyricsFormValues = {
  trackId: '',
  language: 'en',
  content: '',
};

const CreateLyrics = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trackIdFromQuery = searchParams.get('trackId') ?? '';
  const { getTrack, data: trackResponse } = useGetTrack();
  const [createLyrics, { isLoading }] = useCreateLyricsMutation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateLyricsFormValues>({
    defaultValues: {
      ...defaultValues,
      trackId: trackIdFromQuery,
    },
  });

  useEffect(() => {
    if (trackIdFromQuery) {
      setValue('trackId', trackIdFromQuery);
      void getTrack({ id: trackIdFromQuery });
    }
  }, [getTrack, setValue, trackIdFromQuery]);

  const { errors: validateErrors, validateLyrics } = useValidateLyrics();

  const onSubmit: SubmitHandler<CreateLyricsFormValues> = async (data) => {
    try {
      const payload = {
        trackId: data.trackId.trim(),
        language: data.language.trim() || 'en',
        content: data.content
          .split('\n')
          .map((line) => ({ text: line.trim() })),
      };
      const response = await createLyrics(payload).unwrap();
      toast.success('Lyrics created successfully.');
      navigate(`/lyrics/sync?trackId=${payload.trackId}&lyricsId=${response.data.id}`);
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        'Unable to create lyrics.';
      toast.error(errorMessage);
    }
  };

  return (
    <UserLayout>
      <main className="flex w-full flex-col gap-5">
        <header className="rounded-md border border-gray-200/80 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <RelaxedHeading>Lyrics</RelaxedHeading>
              <Heading className="!text-gray-900">Create lyrics record</Heading>
              <p className="text-[12px] text-gray-500">
                Create a track-linked lyrics record before syncing it against the
                uploaded primary audio.
              </p>
            </div>
            <CustomTooltip label="Lyrics guidelines">
              <button
                type="button"
                className="rounded-full border border-gray-200 p-2 text-primary transition-colors hover:bg-gray-50"
                onClick={() => dispatch(setLyricsGuideLinesModal(true))}
              >
                <FontAwesomeIcon icon={faCircleInfo} />
              </button>
            </CustomTooltip>
          </div>
        </header>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <section className="rounded-md border border-gray-200/80 bg-white p-5 shadow-sm">
            <header className="mb-4 space-y-1">
              <Heading type="h3" className="!text-gray-900">
                Record details
              </Heading>
              <p className="text-[12px] text-gray-500">
                {trackResponse?.data?.title
                  ? `Creating lyrics for ${trackResponse.data.title}.`
                  : 'Associate the lyrics with a track and add the base text.'}
              </p>
            </header>

            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                name="trackId"
                control={control}
                rules={{ required: 'Track ID is required' }}
                render={({ field }) => (
                  <label className="flex flex-col gap-1">
                    <Input {...field} label="Track ID" placeholder="Enter track ID" />
                    {errors.trackId && (
                      <InputErrorMessage message={errors.trackId.message} />
                    )}
                  </label>
                )}
              />

              <Controller
                name="language"
                control={control}
                rules={{ required: 'Language is required' }}
                render={({ field }) => (
                  <label className="flex flex-col gap-1">
                    <Input {...field} label="Language" placeholder="en" />
                    {errors.language && (
                      <InputErrorMessage message={errors.language.message} />
                    )}
                  </label>
                )}
              />
            </div>

            <div className="mt-4">
              <Controller
                name="content"
                control={control}
                rules={{ required: 'Lyrics content is required' }}
                render={({ field }) => (
                  <label className="flex flex-col gap-1">
                    <TextArea
                      resize
                      {...field}
                      rows={12}
                      label="Lyrics"
                      placeholder="Enter one lyric line per row"
                      onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                        field.onChange(event);
                        validateLyrics(event.target.value);
                      }}
                    />
                    {errors.content && (
                      <InputErrorMessage message={errors.content.message} />
                    )}
                  </label>
                )}
              />
            </div>

            {validateErrors.length > 0 && (
              <ul className="mt-4 flex flex-col gap-2 rounded-md border border-red-200 bg-red-50/70 p-4 text-[12px] text-red-700">
                {validateErrors.map((error, index) => (
                  <li key={`${error}-${index}`}>{error}</li>
                ))}
              </ul>
            )}
          </section>

          <footer className="flex items-center justify-end gap-3">
            <Button route="/lyrics">Cancel</Button>
            <Button primary submit isLoading={isLoading}>
              Create and sync
            </Button>
          </footer>
        </form>
      </main>
    </UserLayout>
  );
};

export default CreateLyrics;
