import Button from "@/components/inputs/Button";
import { ReleaseWizardStepProps } from "../ReleaseWizardPage";
import {
  useCompleteReleaseNavigationFlow,
  useCreateReleaseNavigationFlow,
} from "@/hooks/releases/navigation.hooks";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
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
import { Track } from "@/types/models/track.types";
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

  const { createReleaseNavigationFlow, isLoading: createNavigationFlowIsLoading } =
    useCreateReleaseNavigationFlow();
  const { completeReleaseNavigationFlow, isLoading: completeNavigationFlowIsLoading } =
    useCompleteReleaseNavigationFlow();

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
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Unable to update track order.";
      toast.error(errorMessage);
    }
  };

  return (
    <section className="flex w-full flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-white">
        <RelaxedHeading>Tracks List</RelaxedHeading>
        <Button
          primary
          className="self-end"
          icon={faPlusSquare}
          onClick={(e) => {
            e.preventDefault();
            dispatch(setCreateReleaseTrackModal(true));
          }}
        >
          Add Track
        </Button>
      </header>

      <article className="rounded-md bg-white py-4">
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
                <p className="mb-2 px-1 text-[11px] text-[color:var(--lens-ink)]/55">
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
          <section className="rounded-xl border border-dashed border-[color:var(--lens-sand)] bg-[color:var(--lens-sand)]/10 p-5 text-center">
            <p className="text-[12px] text-[color:var(--lens-ink)]/65 font-normal">
              No tracks yet.
            </p>
            <Button
              primary
              icon={faPlusSquare}
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

      <footer className="w-full flex items-center gap-3 justify-between">
        <Button
          onClick={(e) => {
            e.preventDefault();
            previousStepName &&
              release?.id &&
              createReleaseNavigationFlow({
                releaseId: release?.id,
                staticReleaseNavigationStepName: previousStepName,
              });
          }}
        >
          Back
        </Button>
        <Button
          primary
          isLoading={
            createNavigationFlowIsLoading || completeNavigationFlowIsLoading
          }
          disabled={
            createNavigationFlowIsLoading || completeNavigationFlowIsLoading
          }
          onClick={async (e) => {
            e.preventDefault();
            if (!nextStepName || !release?.id) return;
            if (currentStepName) {
              await completeReleaseNavigationFlow({
                staticReleaseNavigationStepName: currentStepName,
                isCompleted: true,
              });
            }
            await createReleaseNavigationFlow({
              releaseId: release.id,
              staticReleaseNavigationStepName: nextStepName,
            });
          }}
        >
          Save and continue
        </Button>
      </footer>
      <CreateReleaseTrack />
      <Modal
        isOpen={Boolean(trackToDelete)}
        onClose={() => setTrackToDelete(undefined)}
        headingClassName="text-red-700"
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
                const apiError = error as {
                  data?: { message?: string | string[] };
                };
                const message = apiError.data?.message;
                toast.error(
                  Array.isArray(message)
                    ? message.join(", ")
                    : message || "Unable to delete track",
                );
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
