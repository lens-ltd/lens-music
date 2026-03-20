import { useGetRelease } from "@/hooks/releases/release.hooks";
import { useGetTrack } from "@/hooks/tracks/track.hooks";
import { useAppSelector } from "@/state/hooks";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const ManageReleaseTrack = () => {
  const { id, trackId } = useParams();

  const { track } = useAppSelector((state) => state.track);
  const { release } = useAppSelector((state) => state.release);

  // GET TRACK
  const { getTrack } = useGetTrack();

  // GET RELEASE
  const { getRelease } = useGetRelease();

  useEffect(() => {
    if (trackId) {
      getTrack({ id: trackId });
    }
    if (id) {
      getRelease({ id });
    }
  }, [trackId, getTrack, id, getRelease]);

  return (
    <div>
      <h1>Manage Release Track</h1>
      <h1>{track?.title}</h1>
      <h1>{release?.title}</h1>
    </div>
  );
};

export default ManageReleaseTrack;
