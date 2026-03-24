import Button from "@/components/inputs/Button";
import { ReleaseWizardStepProps } from "../ReleaseWizardPage";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/state/hooks";
import { useCompleteReleaseNavigationFlow, useCreateReleaseNavigationFlow } from "@/hooks/releases/navigation.hooks";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Heading } from "@/components/text/Headings";
import Input from "@/components/inputs/Input";
import { useEffect, useMemo, useState } from "react";
import Combobox from "@/components/inputs/Combobox";
import { capitalizeString } from "@/utils/strings.helper";
import {
  ReleaseParentalAdvisory,
  ReleaseType,
} from "@/types/models/release.types";
import { getProductionYearOptions } from "@/utils/releases.helper";
import Modal from "@/components/modals/Modal";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useUpdateReleaseOverview,
  useUploadReleaseCoverArt,
} from "@/hooks/releases/release.hooks";
import { toast } from "sonner";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { LANGUAGES_LIST } from "@/constants/languages.constants";
import { InputErrorMessage } from "@/components/feedbacks/ErrorLabels";
import { useFetchGenres, useUpsertReleaseGenre } from "@/hooks/releases/genre.hooks";
import { Genre } from "@/types/models/genre.types";
import { ReleaseGenreType } from "@/types/models/releaseGenre.types";

interface ReleaseOverviewFormValues {
  type: ReleaseType;
  title: string;
  titleVersion?: string;
  version?: string;
  productionYear: string;
  originalReleaseDate: string;
  digitalReleaseDate: string;
  preorderDate?: string;
  cLine: {
    year: string;
    owner: string;
  };
  pLine: {
    year: string;
    owner: string;
  };
  parentalAdvisory: ReleaseParentalAdvisory;
  primaryLanguage: string;
  primaryGenreId: string;
  secondaryGenreId?: string;
}

const getMutationErrorMessage = (error: unknown) => {
  if (typeof error !== "object" || !error) return "Failed to upload cover art";

  const errorWithData = error as {
    data?: { message?: string } | string;
    error?: string;
  };

  if (typeof errorWithData.data === "string") return errorWithData.data;
  if (typeof errorWithData.data?.message === "string")
    return errorWithData.data.message;
  if (typeof errorWithData.error === "string") return errorWithData.error;

  return "Failed to upload cover art";
};

const normalizeOptionalString = (value?: string) => {
  const normalizedValue = value?.trim();
  return normalizedValue ? normalizedValue : undefined;
};

const ReleaseWizardOverview = ({
  nextStepName,
  previousStepName,
  currentStepName,
}: ReleaseWizardStepProps) => {
  // STATE
  const { release } = useAppSelector((state) => state.release);
  const [coverArtModalOpen, setCoverArtModalOpen] = useState(false);
  const [selectedCoverArt, setSelectedCoverArt] = useState<File | undefined>(
    undefined,
  );
  const [coverArtError, setCoverArtError] = useState<string | undefined>(
    undefined,
  );

  // NAVIGATION
  const navigate = useNavigate();

  // CREATE NAVIGATION FLOW
  const { createReleaseNavigationFlow, isLoading: createNavigationFlowIsLoading } = useCreateReleaseNavigationFlow();

  // COMPLETE NAVIGATION FLOW
  const { completeReleaseNavigationFlow, isLoading: completeNavigationFlowIsLoading } =
    useCompleteReleaseNavigationFlow();

  // UPLOAD COVER ART
  const {
    uploadReleaseCoverArt,
    isLoading: isUploadingCoverArt,
    reset: resetUploadReleaseCoverArt,
  } = useUploadReleaseCoverArt();
  const {
    updateReleaseOverview,
    isLoading: isUpdatingReleaseOverview,
    reset: resetUpdateReleaseOverview,
  } = useUpdateReleaseOverview();
  const [overviewError, setOverviewError] = useState<string | undefined>(
    undefined,
  );
  const { fetchGenres, data: genresResponse } = useFetchGenres();
  const { upsertReleaseGenre } = useUpsertReleaseGenre();

  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ReleaseOverviewFormValues>();

  // HANDLE SUBMISSION
  const onSubmit: SubmitHandler<ReleaseOverviewFormValues> = async (data) => {
    if (!release?.id) {
      setOverviewError("Release is not available yet");
      return;
    }

    setOverviewError(undefined);
    resetUpdateReleaseOverview();

    const payload = {
      title: data.title.trim(),
      type: data.type,
      titleVersion: normalizeOptionalString(data.titleVersion),
      version: normalizeOptionalString(data.version),
      productionYear: Number(data.productionYear),
      originalReleaseDate: data.originalReleaseDate,
      digitalReleaseDate: data.digitalReleaseDate,
      preorderDate: normalizeOptionalString(data.preorderDate),
      cLine: {
        year: Number(data.cLine.year),
        owner: data.cLine.owner.trim(),
      },
      pLine: {
        year: Number(data.pLine.year),
        owner: data.pLine.owner.trim(),
      },
      parentalAdvisory: data.parentalAdvisory,
      primaryLanguage: data.primaryLanguage,
    };

    try {
      await upsertReleaseGenre({
        id: release.id,
        genreId: data.primaryGenreId,
        type: ReleaseGenreType.PRIMARY,
      }).unwrap();

      if (data.secondaryGenreId?.trim()) {
        await upsertReleaseGenre({
          id: release.id,
          genreId: data.secondaryGenreId,
          type: ReleaseGenreType.SECONDARY,
        }).unwrap();
      }

      const response = await updateReleaseOverview({
        id: release.id,
        body: payload,
      }).unwrap();
      toast.success(
        response?.message || "Release overview updated successfully",
      );

      if (currentStepName) {
        await completeReleaseNavigationFlow({
          staticReleaseNavigationStepName: currentStepName,
          isCompleted: true,
        });
      }

      if (nextStepName) {
        await createReleaseNavigationFlow({
          releaseId: release.id,
          staticReleaseNavigationStepName: nextStepName,
        });
      }
    } catch (error) {
      setOverviewError(getMutationErrorMessage(error));
    }
  };

  // SET DEFAULT VALUES
  useEffect(() => {
    fetchGenres({});
  }, [fetchGenres]);

  useEffect(() => {
    if (release) {
      setValue("type", release.type || ReleaseType.ALBUM);
      setValue("title", release.title || "");
      setValue("titleVersion", release.titleVersion || "");
      setValue("version", release.version || "");
      setValue(
        "productionYear",
        release.productionYear ? String(release.productionYear) : "",
      );
      setValue("originalReleaseDate", release.originalReleaseDate || "");
      setValue("digitalReleaseDate", release.digitalReleaseDate || "");
      setValue("preorderDate", release.preorderDate || "");
      setValue(
        "cLine.year",
        release.cLine?.year ? String(release.cLine.year) : "",
      );
      setValue("cLine.owner", release.cLine?.owner || "");
      setValue(
        "pLine.year",
        release.pLine?.year ? String(release.pLine.year) : "",
      );
      setValue("pLine.owner", release.pLine?.owner || "");
      setValue(
        "parentalAdvisory",
        release.parentalAdvisory || ReleaseParentalAdvisory.NOT_EXPLICIT,
      );
      setValue("primaryLanguage", release.primaryLanguage || "");
      setValue(
        "primaryGenreId",
        release.genres?.find((item) => item.type === ReleaseGenreType.PRIMARY)
          ?.genreId || "",
      );
      setValue(
        "secondaryGenreId",
        release.genres?.find((item) => item.type === ReleaseGenreType.SECONDARY)
          ?.genreId || "",
      );
    }
  }, [release, setValue]);

  const genreOptions = (genresResponse?.data ?? []).map((genre: Genre) => ({
    label: genre.name,
    value: genre.id,
  }));

  const closeCoverArtModal = () => {
    setCoverArtModalOpen(false);
    setSelectedCoverArt(undefined);
    setCoverArtError(undefined);
    resetUploadReleaseCoverArt();
  };

  const selectedFileName = useMemo(
    () => selectedCoverArt?.name,
    [selectedCoverArt],
  );

  const handleUploadCoverArt = async () => {
    if (!release?.id) {
      setCoverArtError("Release is not available yet");
      return;
    }

    if (!selectedCoverArt) {
      setCoverArtError("Please choose an image to upload");
      return;
    }

    setCoverArtError(undefined);

    const formData = new FormData();
    formData.append("file", selectedCoverArt);

    try {
      const response = await uploadReleaseCoverArt({
        id: release.id,
        formData,
      }).unwrap();
      toast.success(
        response?.message || "Release cover art uploaded successfully",
      );
      closeCoverArtModal();
    } catch (error) {
      setCoverArtError(getMutationErrorMessage(error));
    }
  };

  return (
    <section className="flex flex-col gap-4 w-full">
      <form
        className="w-full flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* COVER ART */}
        <menu className="w-full flex flex-col gap-3">
          <Heading type="h3">Cover Art</Heading>
          <article className="w-full rounded-md border border-secondary/20 bg-white p-4 sm:p-5">
            {release?.coverArtUrl ? (
              <section className="flex flex-col gap-4">
                <figure className="mx-auto w-1/2 max-w-[20vw] overflow-hidden rounded-md border border-secondary/20 bg-secondary/5">
                  <img
                    src={release.coverArtUrl}
                    alt={`${release?.title || "Release"} cover art`}
                    className="aspect-square w-full object-cover"
                  />
                </figure>
                <menu className="flex items-center justify-between gap-3">
                  <menu className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-[color:var(--lens-ink)]">
                      Current cover art
                    </p>
                    <p className="text-[12px] text-secondary/80 font-normal">
                      This image will represent the release in the overview.
                    </p>
                  </menu>
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    className="cursor-pointer text-primary hover:text-primary/80"
                    onClick={(e) => {
                      e.preventDefault();
                      setCoverArtModalOpen(true);
                    }}
                  />
                </menu>
              </section>
            ) : (
              <section className="flex flex-col gap-4 rounded-xl border border-dashed border-secondary/30 bg-secondary/5 p-5">
                <menu className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-[color:var(--lens-ink)]">
                    No cover art uploaded
                  </p>
                  <p className="text-[12px] text-secondary/80 font-normal">
                    Upload a release cover image to make it visible at the top
                    of this overview.
                  </p>
                </menu>
                <menu>
                  <Button
                    primary
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setCoverArtModalOpen(true);
                    }}
                  >
                    Upload cover art
                  </Button>
                </menu>
              </section>
            )}
          </article>
        </menu>

        {/* DETAILS */}
        <menu className="w-full flex flex-col gap-3">
          <Heading type="h3">Details</Heading>
          <fieldset className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="type"
              control={control}
              rules={{ required: "Please select the type" }}
              render={({ field }) => (
                <Combobox
                  {...field}
                  label="Type"
                  placeholder="Select the type"
                  required
                  options={Object.entries(ReleaseType).map(([key, value]) => ({
                    label: capitalizeString(key),
                    value: value,
                  }))}
                  errorMessage={errors?.type?.message}
                />
              )}
            />
            <Controller
              name="title"
              rules={{ required: `Please enter the title` }}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Title"
                  placeholder="Enter the title"
                  required
                  errorMessage={errors?.title?.message}
                />
              )}
            />
            <Controller
              name="titleVersion"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Title Version (optional)"
                  placeholder="Enter the title version"
                />
              )}
            />
            <Controller
              name="version"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Version (optional)"
                  placeholder="Enter the version"
                />
              )}
            />
          </fieldset>
        </menu>
        {/* PRODUCTION INFORMATION */}
        <menu className="w-full flex flex-col gap-3">
          <Heading type="h3">Production Information</Heading>
          <fieldset className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="productionYear"
              control={control}
              rules={{ required: `Please enter the production year` }}
              render={({ field }) => (
                <Combobox
                  {...field}
                  label="Production Year"
                  placeholder="Enter the production year"
                  required
                  options={getProductionYearOptions()?.map((year) => ({
                    label: year.label,
                    value: String(year.value),
                  }))}
                  errorMessage={errors?.productionYear?.message}
                />
              )}
            />
            <Controller
              name="originalReleaseDate"
              rules={{ required: `Please enter the original release date` }}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Original Release Date"
                  placeholder="Enter the original release date"
                  type="date"
                  required
                  errorMessage={errors?.originalReleaseDate?.message}
                />
              )}
            />
            <Controller
              name="digitalReleaseDate"
              rules={{ required: `Please enter the digital release date` }}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Digital Release Date"
                  placeholder="Enter the digital release date"
                  type="date"
                  required
                  errorMessage={errors?.digitalReleaseDate?.message}
                />
              )}
            />
            <Controller
              name="preorderDate"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Preorder Date (optional)"
                  placeholder="Enter the preorder date"
                  type="date"
                />
              )}
            />
          </fieldset>
        </menu>
        <menu className="w-full flex flex-col gap-4">
          <Heading type="h3">Rights</Heading>
          <fieldset className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="cLine.year"
              control={control}
              rules={{ required: `Please enter the Control Line year` }}
              render={({ field }) => (
                <Combobox
                  {...field}
                  options={getProductionYearOptions()?.map((year) => ({
                    label: year.label,
                    value: String(year.value),
                  }))}
                  label="Control Line Year"
                  placeholder="Select the Control Line year"
                  required
                  errorMessage={errors?.cLine?.year?.message}
                />
              )}
            />
            <Controller
              name="cLine.owner"
              control={control}
              rules={{ required: `Please enter the Control Line owner` }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Control Line Owner"
                  placeholder="Enter the Control Line owner"
                  required
                  errorMessage={errors?.cLine?.owner?.message}
                />
              )}
            />
            <Controller
              name="pLine.year"
              control={control}
              rules={{ required: `Please enter the Performance Line year` }}
              render={({ field }) => (
                <Combobox
                  {...field}
                  options={getProductionYearOptions()?.map((year) => ({
                    label: year.label,
                    value: String(year.value),
                  }))}
                  label="Performance Line Year"
                  placeholder="Select the Performance Line year"
                  required
                  errorMessage={errors?.pLine?.year?.message}
                />
              )}
            />
            <Controller
              name="pLine.owner"
              control={control}
              rules={{ required: `Please enter the Performance Line owner` }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Performance Line Owner"
                  placeholder="Enter the Performance Line owner"
                  required
                  errorMessage={errors?.pLine?.owner?.message}
                />
              )}
            />
          </fieldset>
        </menu>
        <menu className="w-full flex flex-col gap-4">
          <Heading type="h3">Additional Information</Heading>
          <fieldset className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="parentalAdvisory"
              control={control}
              rules={{ required: "Please select the parental advisory" }}
              render={({ field }) => (
                <Combobox
                  {...field}
                  label="Parental Advisory"
                  placeholder="Select the parental advisory"
                  options={Object.entries(ReleaseParentalAdvisory).map(
                    ([key, value]) => ({
                      label: capitalizeString(key),
                      value: value,
                    }),
                  )}
                  required
                  errorMessage={errors?.parentalAdvisory?.message}
                />
              )}
            />
            <Controller
              name="primaryLanguage"
              control={control}
              rules={{ required: "Please select the primary language" }}
              render={({ field }) => (
                <Combobox
                  {...field}
                  label="Primary Language"
                  placeholder="Select the metadata language"
                  options={LANGUAGES_LIST.map((language) => ({
                    label: language.name,
                    value: language.code,
                  }))}
                  required
                  errorMessage={errors?.primaryLanguage?.message}
                />
              )}
            />
            <Controller
              name="primaryGenreId"
              control={control}
              rules={{ required: "Please select a primary genre" }}
              render={({ field }) => (
                <Combobox
                  {...field}
                  label="Primary Genre"
                  placeholder="Select the primary genre"
                  options={genreOptions}
                  required
                  errorMessage={errors?.primaryGenreId?.message}
                />
              )}
            />
            <Controller
              name="secondaryGenreId"
              control={control}
              render={({ field }) => (
                <Combobox
                  {...field}
                  label="Secondary Genre (optional)"
                  placeholder="Select the secondary genre"
                  options={genreOptions}
                />
              )}
            />
          </fieldset>
        </menu>
        {overviewError && (
          <InputErrorMessage message={overviewError} className="mt-[-4px]" />
        )}
        <footer className="w-full flex items-center gap-3 justify-between">
          <Button
            onClick={(e) => {
              e.preventDefault();
              if (previousStepName) {
                createReleaseNavigationFlow({
                  releaseId: release?.id,
                  staticReleaseNavigationStepName: previousStepName,
                });
              } else {
                navigate("/releases");
              }
            }}
          >
            Back
          </Button>
          <Button
            primary
            submit
            isLoading={isUpdatingReleaseOverview || createNavigationFlowIsLoading || completeNavigationFlowIsLoading}
            disabled={isUpdatingReleaseOverview}
          >
            Save and continue
          </Button>
        </footer>
      </form>

      <Modal
        isOpen={coverArtModalOpen}
        onClose={closeCoverArtModal}
        heading={release?.coverArtUrl ? "Update Cover Art" : "Upload Cover Art"}
        className="min-w-[min(92vw,32rem)]"
      >
        <section className="flex w-full flex-col gap-4">
          <p className="text-[12px] text-secondary/80">
            Choose an image file and save it to update the release cover art.
          </p>

          <Input
            label="Cover art image"
            type="file"
            accept="image/*"
            required
            onChange={(e) => {
              const file = e.target.files?.[0];
              setSelectedCoverArt(file);
              setCoverArtError(undefined);
            }}
          />

          {selectedFileName && (
            <menu className="flex items-center justify-between gap-3 rounded-lg border border-secondary/20 bg-secondary/5 px-3 py-2">
              <p className="truncate text-[12px] text-[color:var(--lens-ink)]">
                {selectedFileName}
              </p>
              <button
                type="button"
                className="inline-flex items-center justify-center text-red-700"
                onClick={() => {
                  setSelectedCoverArt(undefined);
                  setCoverArtError(undefined);
                }}
                aria-label="Remove selected cover art"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </menu>
          )}

          {coverArtError && (
            <p className="text-[12px] text-red-600">{coverArtError}</p>
          )}

          <menu className="flex items-center justify-between gap-3">
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                closeCoverArtModal();
              }}
            >
              Cancel
            </Button>
            <Button
              primary
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleUploadCoverArt();
              }}
              isLoading={isUploadingCoverArt}
              disabled={!release?.id || isUploadingCoverArt}
            >
              Save cover art
            </Button>
          </menu>
        </section>
      </Modal>
    </section>
  );
};

export default ReleaseWizardOverview;
