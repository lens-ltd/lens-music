import { InputErrorMessage } from "@/components/feedbacks/ErrorLabels";
import Button from "@/components/inputs/Button";
import CustomTooltip from "@/components/inputs/CustomTooltip";
import Input from "@/components/inputs/Input";
import TextArea from "@/components/inputs/TextArea";
import { Heading, RelaxedHeading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { useValidateLyrics } from "@/hooks/lyrics/lyrics.hooks";
import { useGetTrack } from "@/hooks/tracks/track.hooks";
import { setLyricsGuideLinesModal } from "@/state/features/lyricSlice";
import { useCreateLyricsMutation } from "@/state/api/apiMutationSlice";
import { AppDispatch } from "@/state/store";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAppSelector } from "@/state/hooks";
import Combobox from "@/components/inputs/Combobox";
import { LANGUAGES_LIST } from "@/constants/languages.constants";
import LyricsGuidelines from "./LyricsGuidelines";

type CreateLyricsFormValues = {
  trackId: string;
  language: string;
  content: string;
};

const CreateLyrics = () => {
  const dispatch: AppDispatch = useDispatch();
  const { track } = useAppSelector((state) => state.track);

  // NAVIGATION
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trackIdFromQuery = searchParams.get("trackId") ?? "";

  // FETCH TRACK
  const { getTrack, data: trackResponse } = useGetTrack();
  const [createLyrics, { isLoading }] = useCreateLyricsMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateLyricsFormValues>({
    defaultValues: {
      trackId: trackIdFromQuery,
    },
  });

  useEffect(() => {
    if (trackIdFromQuery && track?.id) {
      setValue("trackId", track?.title);
      void getTrack({ id: trackIdFromQuery });
    }
    setValue("language", "en");
  }, [getTrack, setValue, trackIdFromQuery, track?.id, track?.title]);

  const { errors: validateErrors, validateLyrics } = useValidateLyrics();

  const onSubmit: SubmitHandler<CreateLyricsFormValues> = async (data) => {
    try {
      const payload = {
        trackId: trackIdFromQuery,
        language: data.language || "en",
        content: data.content
          .split("\n")
          .map((line) => ({ text: line.trim() })),
      };
      const response = await createLyrics(payload).unwrap();
      toast.success("Lyrics created successfully.");
      navigate(
        `/lyrics/sync?trackId=${trackIdFromQuery}&lyricsId=${response.data.id}`,
      );
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Unable to create lyrics.";
      toast.error(errorMessage);
    }
  };

  return (
    <UserLayout>
      <main className="flex w-full flex-col gap-5">
        <header className="rounded-md">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <RelaxedHeading>Lyrics</RelaxedHeading>
              <Heading type="h3" className="!text-gray-900">
                Create lyrics record
              </Heading>
              <p className="text-[12px] text-gray-500">
                Create a track-linked lyrics record before syncing it against
                the uploaded primary audio.
              </p>
            </div>
            <CustomTooltip label="Lyrics guidelines">
              <FontAwesomeIcon
                className="cursor-pointer text-primary"
                icon={faCircleInfo}
                onClick={(event) => {
                  event.preventDefault();
                  dispatch(setLyricsGuideLinesModal(true));
                }}
              />
            </CustomTooltip>
          </div>
        </header>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <section className="rounded-md">
            <header className="mb-4 space-y-1">
              <Heading type="h3" className="!text-gray-900">
                Record details
              </Heading>
              <p className="text-[12px] text-gray-500">
                {trackResponse?.data?.title
                  ? `Creating lyrics for ${trackResponse.data.title}.`
                  : "Associate the lyrics with a track and add the base text."}
              </p>
            </header>

            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                name="trackId"
                control={control}
                rules={{ required: "Track name is required" }}
                render={({ field }) => (
                  <label className="flex flex-col gap-1">
                    <Input
                      {...field}
                      label="Track name"
                      placeholder="Enter track name"
                      readOnly={!!(trackIdFromQuery && track?.id)}
                    />
                    {errors.trackId && (
                      <InputErrorMessage message={errors.trackId.message} />
                    )}
                  </label>
                )}
              />

              <Controller
                name="language"
                control={control}
                rules={{ required: "Language is required" }}
                render={({ field }) => (
                  <label className="flex flex-col gap-1">
                    <Combobox
                      {...field}
                      label="Language"
                      placeholder="Select the language"
                      options={LANGUAGES_LIST.map((language) => ({
                        label: language.name,
                        value: language.code,
                      }))}
                    />
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
                rules={{ required: "Lyrics content is required" }}
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

          <footer className="flex items-center justify-between gap-3">
            <Button
              onClick={(event) => {
                event.preventDefault();
                dispatch(setLyricsGuideLinesModal(false));
                navigate(-1);
              }}
            >
              Cancel
            </Button>
            <Button primary submit isLoading={isLoading}>
              Create and sync
            </Button>
          </footer>
        </form>
      </main>

      <LyricsGuidelines />
    </UserLayout>
  );
};

export default CreateLyrics;
