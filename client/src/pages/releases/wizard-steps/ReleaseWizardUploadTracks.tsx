import Button from "@/components/inputs/Button";
import { BackButton } from "@/components/layout/PageFooter";
import { ReleaseWizardStepProps } from "../ReleaseWizardPage";
import { useWizardStepNavigation } from "@/hooks/releases/wizardStepNavigation.hooks";
import { getApiErrorMessage } from "@/utils/errors.helper";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { setCreateReleaseTrackModal } from "@/state/features/trackSlice";
import CreateReleaseTrack from "../../tracks/CreateReleaseTrack";
import {
  useDeleteTrack,
  useFetchTracks,
  useReorderTracks,
} from "@/hooks/tracks/track.hooks";
import { useEffect, useMemo, useState } from "react";
import ReleaseTrackCard from "@/components/tracks/ReleaseTrackCard";
import SortableTrackItem from "@/components/tracks/SortableTrackItem";
import { RelaxedHeading } from "@/components/text/Headings";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/modals/Modal";
import { Track, TrackStatus } from "@/types/models/track.types";
import { ReleaseStatus } from "@/types/models/release.types";
import { toast } from "sonner";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { LuSquarePlus } from 'react-icons/lu';

const sortTracksForDisplay = (tracks: Track[]) =>
  [...tracks].sort(
    (first, second) =>
      (first.discNumber ?? 1) - (second.discNumber ?? 1) ||
      (first.trackNumber ?? 0) - (second.trackNumber ?? 0),
  );

const ReleaseWizardUploadTracks = ({
  currentStepName,
  nextStepName,
  previousStepName,
}: ReleaseWizardStepProps) => {
  // STATE
  const dispatch = useAppDispatch();
  const { release } = useAppSelector((state) => state.release);
  const { tracksList } = useAppSelector((state) => state.track);
  const [trackToDelete, setTrackToDelete] = useState<Track>();
  const [orderedTracks, setOrderedTracks] = useState<Track[]>([]);

  // NAVIGATION
  const navigate = useNavigate();

  const { goNext, goBack, isNavigating } = useWizardStepNavigation({
    currentStepName,
    nextStepName,
    previousStepName,
  });

  // FETCH TRACKS
  const { fetchTracks, isFetching: tracksIsFetching } = useFetchTracks();
  const { deleteTrack, isLoading: deleteTrackIsLoading } = useDeleteTrack();
  const { reorderTracks, isLoading: isReorderingTracks } = useReorderTracks();

  const canDeleteTracks =
    release?.status === ReleaseStatus.DRAFT ||
    release?.status === ReleaseStatus.VALIDATED;

  // DRAG SENSORS
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (release?.id) {
      fetchTracks({ releaseId: release?.id, size: 100 });
    }
  }, [release?.id, fetchTracks]);

  // Keep the local ordered list in sync with the fetched tracks.
  useEffect(() => {
    setOrderedTracks(sortTracksForDisplay(tracksList ?? []));
  }, [tracksList]);

  const trackIds = useMemo(
    () => orderedTracks.map((track) => track.id),
    [orderedTracks],
  );
  const hasTracks = orderedTracks.length > 0;
  const allTracksValidated =
    hasTracks &&
    orderedTracks.every((track) => track.status === TrackStatus.VALIDATED);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !release?.id) return;

    const oldIndex = orderedTracks.findIndex((track) => track.id === active.id);
    const newIndex = orderedTracks.findIndex((track) => track.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const previousOrder = orderedTracks;
    const nextOrder = arrayMove(orderedTracks, oldIndex, newIndex);
    setOrderedTracks(nextOrder);

    try {
      await reorderTracks({
        releaseId: release.id,
        trackIds: nextOrder.map((track) => track.id),
      }).unwrap();
      await fetchTracks({ releaseId: release.id });
      toast.success("Track order updated.");
    } catch (error) {
      setOrderedTracks(previousOrder);
      toast.error(getApiErrorMessage(error, "Unable to update track order."));
    }
  };

  return (
    <section className="flex w-full flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <RelaxedHeading>Tracks List</RelaxedHeading>
        <Button
          primary
          className="self-end"
          icon={LuSquarePlus}
          onClick={(e) => {
            e.preventDefault();
            dispatch(setCreateReleaseTrackModal(true));
          }}
        >
          Add Track
        </Button>
      </header>

      <article className="py-4">
        {orderedTracks?.length || tracksIsFetching ? (
          tracksIsFetching && !orderedTracks.length ? (
            <ul
              className="m-0 flex list-none flex-col gap-2.5 p-0"
              aria-label="Release tracks"
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <li key={index}>
                  <ReleaseTrackCard isLoading />
                </li>
              ))}
            </ul>
          ) : (
            <>
              {orderedTracks.length > 1 && (
                <p className="mb-2 px-1 text-xs text-(--muted)">
                  Drag the handle to reorder tracks.
                </p>
              )}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={trackIds}
                  strategy={verticalListSortingStrategy}
                >
                  <ul
                    className="m-0 flex list-none flex-col gap-2.5 p-0"
                    aria-label="Release tracks"
                  >
                    {orderedTracks.map((track) => (
                      <li key={track?.id}>
                        <SortableTrackItem
                          track={track}
                          disabled={isReorderingTracks}
                          onManage={() => {
                            navigate(
                              `/releases/${release?.id}/manage-tracks/${track?.id}`,
                            );
                          }}
                          canDelete={canDeleteTracks}
                          onDelete={() => setTrackToDelete(track)}
                        />
                      </li>
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>
            </>
          )
        ) : (
          <section className="rounded-(--radius-card) border border-dashed border-(--line-hover) bg-(--surface) p-5 text-center">
            <p className="text-[13px] text-(--muted) font-normal">
              No tracks yet.
            </p>
            <Button
              primary
              icon={LuSquarePlus}
              className="mt-3"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setCreateReleaseTrackModal(true));
              }}
            >
              Add first track
            </Button>
          </section>
        )}
      </article>

      {!allTracksValidated ? (
        <p
          className="rounded-md bg-(--surface) px-4 py-3 text-xs leading-5 text-(--muted)"
          role="status"
        >
          {hasTracks
            ? "Finish and validate every track before continuing."
            : "Add at least one track before continuing."}
        </p>
      ) : null}

      <footer className="sticky bottom-0 flex w-full items-center justify-between gap-3 bg-(--paper)/95 py-4">
        <BackButton
          disabled={isNavigating}
          onClick={(e) => {
            e.preventDefault();
            void goBack();
          }}
        >
          Back
        </BackButton>
        <Button
          primary
          isLoading={isNavigating}
          disabled={!allTracksValidated}
          onClick={(e) => {
            e.preventDefault();
            if (!nextStepName) return;
            void goNext();
          }}
        >
          Save and continue
        </Button>
      </footer>
      <CreateReleaseTrack />
      <Modal
        isOpen={Boolean(trackToDelete)}
        onClose={() => setTrackToDelete(undefined)}
        headingClassName="text-(--ink)"
        heading={`Delete ${trackToDelete?.title ?? "track"}`}
      >
        <article className="flex w-full flex-col gap-4">
          <p>
            Are you sure you want to delete {trackToDelete?.title}? This action
            cannot be undone.
          </p>
          <Button
            danger
            className="self-end"
            isLoading={deleteTrackIsLoading}
            disabled={deleteTrackIsLoading}
            onClick={async (e) => {
              e.preventDefault();
              if (!trackToDelete?.id || !release?.id) return;

              try {
                const response = await deleteTrack({
                  id: trackToDelete.id,
                }).unwrap();
                toast.success(response?.message || "Track deleted successfully");
                setTrackToDelete(undefined);
                await fetchTracks({ releaseId: release.id });
              } catch (error) {
                toast.error(getApiErrorMessage(error, "Unable to delete track"));
              }
            }}
          >
            Delete
          </Button>
        </article>
      </Modal>
    </section>
  );
};

export default ReleaseWizardUploadTracks;
