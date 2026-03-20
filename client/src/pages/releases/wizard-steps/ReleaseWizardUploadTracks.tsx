import Button from "@/components/inputs/Button";
import { ReleaseWizardStepProps } from "../ReleaseWizardPage";
import { useCreateReleaseNavigationFlow } from "@/hooks/releases/navigation.hooks";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { setCreateReleaseTrackModal } from "@/state/features/trackSlice";
import CreateReleaseTrack from "../../tracks/CreateReleaseTrack";
import { useFetchTracks } from "@/hooks/tracks/track.hooks";
import { useEffect } from "react";
import ReleaseTrackCard from "@/components/tracks/ReleaseTrackCard";
import { RelaxedHeading } from "@/components/text/Headings";
import { useNavigate } from "react-router-dom";

const ReleaseWizardUploadTracks = ({
  nextStepName,
  previousStepName,
}: ReleaseWizardStepProps) => {
  // STATE
  const dispatch = useAppDispatch();
  const { release } = useAppSelector((state) => state.release);
  const { tracksList } = useAppSelector((state) => state.track);

  // NAVIGATION
  const navigate = useNavigate();

  // CREATE NAVIGATION FLOW
  const { createReleaseNavigationFlow } = useCreateReleaseNavigationFlow();

  // FETCH TRACKS
  const { fetchTracks, isFetching: tracksIsFetching } = useFetchTracks();

  useEffect(() => {
    if (release?.id) {
      fetchTracks({ releaseId: release?.id });
    }
  }, [release?.id, fetchTracks]);

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
        {tracksList?.length || tracksIsFetching ? (
          <ul
            className="m-0 flex list-none flex-col gap-2.5 p-0"
            aria-label="Release tracks"
          >
            {tracksList.map((track) => (
              <li key={track?.id}>
                <ReleaseTrackCard
                  isLoading={tracksIsFetching}
                  track={track}
                  onManage={() => {
                    navigate(
                      `/releases/${release?.id}/manage-tracks/${track?.id}`,
                    );
                  }}
                />
              </li>
            ))}
          </ul>
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
          route="/releases"
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
          onClick={(e) => {
            e.preventDefault();
            nextStepName &&
              release?.id &&
              createReleaseNavigationFlow({
                releaseId: release?.id,
                staticReleaseNavigationStepName: nextStepName,
              });
          }}
        >
          Save and continue
        </Button>
      </footer>
      <CreateReleaseTrack />
    </section>
  );
};

export default ReleaseWizardUploadTracks;
