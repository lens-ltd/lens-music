import Button from "@/components/inputs/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import UserLayout from "@/containers/UserLayout";
import { useGetRelease } from "@/hooks/releases/release.hooks";
import {
  useDeleteTrackAudio,
  useGetTrack,
  useUpdateTrack,
  useValidateTrack,
} from "@/hooks/tracks/track.hooks";
import {
  useCreateTrackContributor,
  useDeleteTrackContributor,
  useFetchTrackContributors,
  useUpdateTrackContributor,
} from "@/hooks/tracks/track-contributor.hooks";
import useTrackAudioUpload from "@/hooks/tracks/useTrackAudioUpload";
import { useAppSelector } from "@/state/hooks";
import { ContributorRole } from "@/types/models/releaseContributor.types";
import { TrackContributor } from "@/types/models/track.types";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDeleteLyricsMutation } from "@/state/api/apiMutationSlice";
import { useLazyFetchContributorsQuery } from "@/state/api/apiQuerySlice";
import { Contributor } from "@/types/models/contributor.types";
import TrackAudioPanel from "./components/TrackAudioPanel";
import TrackContributorsPanel from "./components/TrackContributorsPanel";
import TrackDetailsForm from "./components/TrackDetailsForm";
import TrackEditorHeader from "./components/TrackEditorHeader";
import TrackCopyrightLinesForm from "./components/TrackCopyrightLinesForm";
import TrackRightsControllersPanel from "./components/TrackRightsControllersPanel";
import {
  defaultFormValues,
  FormValues,
  getFormDefaults,
  MIN_CONTRIBUTOR_SEARCH_CHARS,
  ValidationResult,
} from "./components/trackForm.helpers";
import useTrackMetadataAutosave from "./components/useTrackMetadataAutosave";
import { Lyrics } from "@/types/models/lyrics.types";

const formatTrackLyricsLabel = (lyrics: Lyrics) => {
  const createdAt = lyrics.createdAt
    ? new Date(lyrics.createdAt).toLocaleDateString()
    : "Draft";
  return `${lyrics.language.toUpperCase()} · ${createdAt}`;
};

const sortTrackLyricsByNewest = (lyrics: Lyrics[]) =>
  [...lyrics].sort(
    (first, second) =>
      new Date(second.createdAt).getTime() -
      new Date(first.createdAt).getTime(),
  );

const ManageReleaseTrack = () => {
  const { id, trackId } = useParams();
  const navigate = useNavigate();
  const { control, getValues, reset } = useForm<FormValues>({
    defaultValues: defaultFormValues,
  });
  const { track } = useAppSelector((state) => state.track);
  const { release } = useAppSelector((state) => state.release);
  const { getTrack } = useGetTrack();
  const { getRelease } = useGetRelease();
  const { updateTrack, isLoading: isUpdatingTrack } = useUpdateTrack();
  const {
    uploadAudio,
    progress: uploadProgress,
    phase: uploadPhase,
    isUploading: isUploadingAudio,
    isComplete: isUploadComplete,
    reset: resetUpload,
  } = useTrackAudioUpload();
  const { deleteTrackAudio, isLoading: isDeletingAudio } =
    useDeleteTrackAudio();
  const { validateTrack, isLoading: isValidatingTrack } = useValidateTrack();
  const { fetchTrackContributors, data: trackContributorsData } =
    useFetchTrackContributors();
  const { createTrackContributor, isLoading: isCreatingContributor } =
    useCreateTrackContributor();
  const { deleteTrackContributor, isLoading: isDeletingContributor } =
    useDeleteTrackContributor();
  const { updateTrackContributor, isLoading: isUpdatingContributorSequence } =
    useUpdateTrackContributor();
  const [deleteLyrics, { isLoading: isDeletingLyrics }] =
    useDeleteLyricsMutation();
  const [fetchContributors, { isFetching: isSearchingContributors }] =
    useLazyFetchContributorsQuery();
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [selectedContributorId, setSelectedContributorId] = useState("");
  const [selectedContributorRole, setSelectedContributorRole] = useState(
    ContributorRole.PRIMARY_ARTIST,
  );
  const [selectedContributorLabel, setSelectedContributorLabel] = useState("");
  const [contributorSearchTerm, setContributorSearchTerm] = useState("");
  const [contributorSearchResults, setContributorSearchResults] = useState<
    Contributor[]
  >([]);
  const [isContributorSearchPending, setIsContributorSearchPending] =
    useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const latestSearchRequestRef = useRef(0);

  useEffect(() => {
    if (trackId) {
      getTrack({ id: trackId });
      fetchTrackContributors({ trackId });
    }
    if (id) {
      getRelease({ id });
    }
  }, [fetchTrackContributors, getRelease, getTrack, id, trackId]);

  useEffect(() => {
    reset(getFormDefaults(track));
  }, [reset, track]);

  useEffect(() => {
    const trimmedSearchTerm = contributorSearchTerm.trim();

    if (trimmedSearchTerm.length < MIN_CONTRIBUTOR_SEARCH_CHARS) {
      setContributorSearchResults([]);
      setIsContributorSearchPending(false);
      return;
    }

    if (
      selectedContributorId &&
      trimmedSearchTerm === selectedContributorLabel
    ) {
      setContributorSearchResults([]);
      setIsContributorSearchPending(false);
      return;
    }

    const requestId = latestSearchRequestRef.current + 1;
    latestSearchRequestRef.current = requestId;

    setIsContributorSearchPending(true);

    const timeout = window.setTimeout(() => {
      void (async () => {
        try {
          const response = await fetchContributors({
            page: 0,
            size: 10,
            searchKey: trimmedSearchTerm,
          }).unwrap();

          if (latestSearchRequestRef.current !== requestId) {
            return;
          }

          setContributorSearchResults(response?.data?.rows ?? []);
        } catch (error) {
          if (latestSearchRequestRef.current !== requestId) {
            return;
          }

          setContributorSearchResults([]);
          const errorMessage =
            (error as { data?: { message?: string } })?.data?.message ||
            "Unable to search contributors.";
          toast.error(errorMessage);
        } finally {
          if (latestSearchRequestRef.current === requestId) {
            setIsContributorSearchPending(false);
          }
        }
      })();
    }, 2000);

    return () => {
      window.clearTimeout(timeout);
      setIsContributorSearchPending(false);
    };
  }, [
    contributorSearchTerm,
    fetchContributors,
    selectedContributorId,
    selectedContributorLabel,
  ]);

  const resetValidationResult = useCallback(() => {
    setValidationResult(null);
  }, []);
  const { detailStateLabel, persistFieldUpdate, rightsStateLabel } =
    useTrackMetadataAutosave({
      track,
      trackId,
      getValues,
      getTrack,
      updateTrack,
      onResetValidationResult: resetValidationResult,
      onError: toast.error,
    });

  const handleValidateTrack = useCallback(async () => {
    if (!trackId || !id) return;
    try {
      const response = await validateTrack({ id: trackId }).unwrap();
      setValidationResult(response.data);

      if (response.data?.valid) {
        toast.success("Track validated successfully.");
        navigate(`/releases/${id}/wizard`);
      }
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Track validation failed.";
      toast.error(errorMessage);
    }
  }, [id, navigate, trackId, validateTrack]);

  const handleAudioUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !trackId) return;
      resetValidationResult();
      setUploadFileName(file.name);
      try {
        await uploadAudio(trackId, file);
        await getTrack({ id: trackId });
        toast.success("Audio uploaded successfully.");
        setTimeout(() => resetUpload(), 3000);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unable to upload audio.";
        toast.error(errorMessage);
        resetUpload();
      } finally {
        event.target.value = "";
      }
    },
    [getTrack, resetUpload, resetValidationResult, trackId, uploadAudio],
  );

  const handleDeleteAudio = useCallback(
    async (audioFileId: string) => {
      if (!trackId) return;
      resetValidationResult();
      try {
        await deleteTrackAudio({ id: trackId, audioFileId }).unwrap();
        await getTrack({ id: trackId });
        toast.success("Audio removed successfully.");
      } catch (error) {
        const errorMessage =
          (error as { data?: { message?: string } })?.data?.message ||
          "Unable to remove audio.";
        toast.error(errorMessage);
      }
    },
    [deleteTrackAudio, getTrack, resetValidationResult, trackId],
  );

  const handleAddContributor = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!trackId || !selectedContributorId) {
        toast.error("Select a contributor before adding.");
        return;
      }
      const duplicateContributor = trackContributorsData?.data?.some(
        (trackContributor: TrackContributor) =>
          trackContributor.contributorId === selectedContributorId &&
          trackContributor.role === selectedContributorRole,
      );
      if (duplicateContributor) {
        toast.error("That contributor already has this role on the track.");
        return;
      }
      resetValidationResult();
      try {
        await createTrackContributor({
          trackId,
          contributorId: selectedContributorId,
          role: selectedContributorRole,
        }).unwrap();
        await fetchTrackContributors({ trackId });
        setSelectedContributorId("");
        setSelectedContributorLabel("");
        setSelectedContributorRole(ContributorRole.PRIMARY_ARTIST);
        setContributorSearchTerm("");
        setContributorSearchResults([]);
        toast.success("Contributor added successfully.");
      } catch (error) {
        const errorMessage =
          (error as { data?: { message?: string } })?.data?.message ||
          "Unable to add contributor.";
        toast.error(errorMessage);
      }
    },
    [
      createTrackContributor,
      fetchTrackContributors,
      resetValidationResult,
      selectedContributorId,
      selectedContributorRole,
      trackContributorsData,
      trackId,
    ],
  );

  const handleContributorSearchChange = useCallback(
    (value: string) => {
      setContributorSearchTerm(value);
      if (selectedContributorId && value !== selectedContributorLabel) {
        setSelectedContributorId("");
        setSelectedContributorLabel("");
      }
    },
    [selectedContributorId, selectedContributorLabel],
  );

  const handleSelectContributor = useCallback((contributor: Contributor) => {
    const label =
      contributor.displayName || contributor.name || contributor.email || "";
    setSelectedContributorId(contributor.id);
    setSelectedContributorLabel(label);
    setContributorSearchTerm(label);
    setContributorSearchResults([]);
  }, []);

  const handleUpdateContributorSequence = useCallback(
    async (trackContributorId: string, sequenceNumber: number | undefined) => {
      if (!trackId || sequenceNumber === undefined || Number.isNaN(sequenceNumber)) {
        return;
      }
      const current = trackContributorsData?.data?.find(
        (tc: TrackContributor) => tc.id === trackContributorId,
      );
      if (current?.sequenceNumber === sequenceNumber) return;
      resetValidationResult();
      try {
        await updateTrackContributor({
          id: trackContributorId,
          body: { sequenceNumber },
        }).unwrap();
        await fetchTrackContributors({ trackId });
      } catch (error) {
        const errorMessage =
          (error as { data?: { message?: string } })?.data?.message ||
          "Unable to update order.";
        toast.error(errorMessage);
      }
    },
    [
      fetchTrackContributors,
      resetValidationResult,
      trackContributorsData?.data,
      trackId,
      updateTrackContributor,
    ],
  );

  const handleDeleteContributor = useCallback(
    async (trackContributorId: string) => {
      if (!trackId) return;
      resetValidationResult();
      try {
        await deleteTrackContributor({ id: trackContributorId }).unwrap();
        await fetchTrackContributors({ trackId });
        toast.success("Contributor removed successfully.");
      } catch (error) {
        const errorMessage =
          (error as { data?: { message?: string } })?.data?.message ||
          "Unable to remove contributor.";
        toast.error(errorMessage);
      }
    },
    [
      deleteTrackContributor,
      fetchTrackContributors,
      resetValidationResult,
      trackId,
    ],
  );

  const handleDeleteLyrics = useCallback(
    async (lyricsIdToDelete: string) => {
      if (!trackId) return;
      if (
        !window.confirm(
          "Delete this lyrics record? Timed sync data will be lost.",
        )
      ) {
        return;
      }
      resetValidationResult();
      try {
        await deleteLyrics({ id: lyricsIdToDelete }).unwrap();
        await getTrack({ id: trackId });
        toast.success("Lyrics deleted successfully.");
      } catch (error) {
        const errorMessage =
          (error as { data?: { message?: string } })?.data?.message ||
          "Unable to delete lyrics.";
        toast.error(errorMessage);
      }
    },
    [deleteLyrics, getTrack, resetValidationResult, trackId],
  );

  return (
    <UserLayout>
      <main className="flex w-full flex-col gap-4">
        <article className="flex flex-col gap-5">
          <TrackEditorHeader
            track={track}
            release={release}
            validationResult={validationResult}
          />

          <TrackDetailsForm
            control={control}
            stateLabel={detailStateLabel}
            onPersistField={persistFieldUpdate}
          />

          <TrackCopyrightLinesForm
            control={control}
            stateLabel={rightsStateLabel}
            onPersistField={persistFieldUpdate}
          />

          <TrackRightsControllersPanel trackId={trackId} />

          <TrackAudioPanel
            track={track}
            isUploadingAudio={isUploadingAudio}
            isDeletingAudio={isDeletingAudio}
            uploadProgress={uploadProgress}
            uploadPhase={uploadPhase}
            isUploadComplete={isUploadComplete}
            uploadFileName={uploadFileName}
            onAudioUpload={handleAudioUpload}
            onDeleteAudio={handleDeleteAudio}
            onSyncLyrics={() => {
              if (!trackId) return;
              navigate(`/lyrics/sync?trackId=${trackId}`);
            }}
          />

          <TrackContributorsPanel
            contributorSearchTerm={contributorSearchTerm}
            contributorSearchResults={contributorSearchResults}
            selectedContributorId={selectedContributorId}
            selectedContributorRole={selectedContributorRole}
            trackContributors={trackContributorsData?.data ?? []}
            isSearchingContributors={
              isContributorSearchPending || isSearchingContributors
            }
            isCreatingContributor={isCreatingContributor}
            isDeletingContributor={isDeletingContributor}
            onContributorSearchChange={handleContributorSearchChange}
            onSelectContributor={handleSelectContributor}
            onSelectRole={setSelectedContributorRole}
            onAddContributor={handleAddContributor}
            onDeleteContributor={handleDeleteContributor}
            onUpdateSequence={handleUpdateContributorSequence}
            isUpdatingSequence={isUpdatingContributorSequence}
          />

          <section className="rounded-md border border-[color:var(--lens-sand)]/70 bg-white p-4">
            <header className="space-y-1">
              <h2 className="text-sm font-normal text-[color:var(--lens-ink)]">
                Lyrics
              </h2>
              <p className="text-[12px] text-[color:var(--lens-ink)]/55">
                Lyrics records linked to this track. Open sync to edit timing,
                or remove a record here.
              </p>
            </header>
            {track?.lyrics?.length ? (
              <ul className="mt-3 flex list-none flex-col gap-2 p-0">
                {sortTrackLyricsByNewest(track.lyrics).map((lyric) => (
                  <li
                    key={lyric.id}
                    className="flex items-center justify-between gap-3 rounded-md border border-[color:var(--lens-sand)]/70 p-3"
                  >
                    <p className="text-[12px] text-[color:var(--lens-ink)]">
                      {formatTrackLyricsLabel(lyric)}
                    </p>
                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        styled={false}
                        className="!min-h-0 !px-2 !py-1"
                        onClick={(event) => {
                          event.preventDefault();
                          if (!trackId) return;
                          navigate(
                            `/lyrics/sync?trackId=${trackId}&lyricsId=${lyric.id}`,
                          );
                        }}
                      >
                        Open sync
                      </Button>
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={(event) => {
                          event.preventDefault();
                          if (isDeletingLyrics) return;
                          void handleDeleteLyrics(lyric.id);
                        }}
                        className={`text-[12px] cursor-pointer text-red-700 transition-colors hover:text-red-700 ${
                          isDeletingLyrics
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[12px] text-[color:var(--lens-ink)]/55">
                No lyrics records yet. Use Sync lyrics (with audio uploaded) or
                create lyrics from the Lyrics section.
              </p>
            )}
          </section>

          {isUpdatingTrack && (
            <p className="text-[12px] text-[color:var(--lens-ink)]/55">
              Saving track updates...
            </p>
          )}
        </article>

        <footer className="flex w-full items-center justify-between gap-3">
          <Button
            onClick={(event) => {
              event.preventDefault();
              navigate(-1);
            }}
          >
            Back
          </Button>
          <Button
            primary
            submit
            isLoading={isValidatingTrack}
            onClick={handleValidateTrack}
          >
            Validate and continue
          </Button>
        </footer>
      </main>
    </UserLayout>
  );
};

export default ManageReleaseTrack;
