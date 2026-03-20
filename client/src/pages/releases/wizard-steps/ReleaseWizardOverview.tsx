import Button from "@/components/inputs/Button";
import { ReleaseWizardStepProps } from "../ReleaseWizardPage";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/state/hooks";
import { useCreateReleaseNavigationFlow } from "@/hooks/releases/navigation.hooks";
import { Controller, useForm } from "react-hook-form";
import { Heading } from "@/components/text/Headings";
import Input from "@/components/inputs/Input";
import { useEffect, useMemo, useState } from "react";
import Combobox from "@/components/inputs/Combobox";
import { capitalizeString } from "@/utils/strings.helper";
import { ReleaseType } from "@/types/models/release.types";
import { getProductionYearOptions } from "@/utils/releases.helper";
import Modal from "@/components/modals/Modal";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUploadReleaseCoverArt } from "@/hooks/releases/release.hooks";
import { toast } from "sonner";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const getMutationErrorMessage = (error: unknown) => {
  if (typeof error !== "object" || !error) return "Failed to upload cover art";

  const errorWithData = error as { data?: { message?: string } | string; error?: string };

  if (typeof errorWithData.data === "string") return errorWithData.data;
  if (typeof errorWithData.data?.message === "string") return errorWithData.data.message;
  if (typeof errorWithData.error === "string") return errorWithData.error;

  return "Failed to upload cover art";
};

const ReleaseWizardOverview = ({
  nextStepName,
  previousStepName,
}: ReleaseWizardStepProps) => {
  // STATE
  const { release } = useAppSelector((state) => state.release);
  const [coverArtModalOpen, setCoverArtModalOpen] = useState(false);
  const [selectedCoverArt, setSelectedCoverArt] = useState<File | undefined>(undefined);
  const [coverArtError, setCoverArtError] = useState<string | undefined>(undefined);

  // NAVIGATION
  const navigate = useNavigate();

  // CREATE NAVIGATION FLOW
  const { createReleaseNavigationFlow } = useCreateReleaseNavigationFlow();
  const { uploadReleaseCoverArt, isLoading: isUploadingCoverArt, reset: resetUploadReleaseCoverArt } =
    useUploadReleaseCoverArt();

  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // HANDLE SUBMISSION
  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  // SET DEFAULT VALUES
  useEffect(() => {
    if (release) {
      Object.entries(release).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [release, setValue]);

  const closeCoverArtModal = () => {
    setCoverArtModalOpen(false);
    setSelectedCoverArt(undefined);
    setCoverArtError(undefined);
    resetUploadReleaseCoverArt();
  };

  const selectedFileName = useMemo(() => selectedCoverArt?.name, [selectedCoverArt]);

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
      const response = await uploadReleaseCoverArt({ id: release.id, formData }).unwrap();
      toast.success(response?.message || "Release cover art uploaded successfully");
      closeCoverArtModal();
    } catch (error) {
      setCoverArtError(getMutationErrorMessage(error));
    }
  };

  return (
    <section className="flex flex-col gap-4 w-full">
      <form className="w-full flex flex-col gap-4" onSubmit={onSubmit}>
        {/* COVER ART */}
        <menu className="w-full flex flex-col gap-3">
          <Heading type="h3">Cover Art</Heading>
          <article className="w-full rounded-2xl border border-secondary/20 bg-white p-4 sm:p-5">
            {release?.coverArtUrl ? (
              <section className="flex flex-col gap-4">
                <figure className="w-full overflow-hidden rounded-xl border border-secondary/20 bg-secondary/5">
                  <img
                    src={release.coverArtUrl}
                    alt={`${release?.title || "Release"} cover art`}
                    className="h-56 w-full object-cover sm:h-72"
                  />
                </figure>
                <menu className="flex items-center justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-[color:var(--lens-ink)]">Current cover art</p>
                    <p className="text-[12px] text-secondary/80">
                      This image will represent the release in the overview.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setCoverArtModalOpen(true);
                    }}
                    icon={faPenToSquare}
                  >
                    Update cover art
                  </Button>
                </menu>
              </section>
            ) : (
              <section className="flex flex-col gap-4 rounded-xl border border-dashed border-secondary/30 bg-secondary/5 p-5">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-[color:var(--lens-ink)]">No cover art uploaded</p>
                  <p className="text-[12px] text-secondary/80">
                    Upload a release cover image to make it visible at the top of this overview.
                  </p>
                </div>
                <div>
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
                </div>
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
                    value: year.value,
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
      </form>
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
          onClick={(e) => {
            e.preventDefault();
            if (nextStepName) {
              createReleaseNavigationFlow({
                releaseId: release?.id,
                staticReleaseNavigationStepName: nextStepName,
              });
            }
          }}
        >
          Save and continue
        </Button>
      </footer>

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
              <p className="truncate text-[12px] text-[color:var(--lens-ink)]">{selectedFileName}</p>
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

          {coverArtError && <p className="text-[12px] text-red-600">{coverArtError}</p>}

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
