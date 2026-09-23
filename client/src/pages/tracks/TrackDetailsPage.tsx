import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BackButton, PageFooter } from "@/components/layout/PageFooter";
import UserLayout from "@/containers/UserLayout";
import { useGetRelease } from "@/hooks/releases/release.hooks";
import { useGetTrack } from "@/hooks/tracks/track.hooks";
import { useAppSelector } from "@/state/hooks";
import { getStatusBackgroundColor } from "@/utils/strings.helper";
import { capitalizeString } from "@/utils/strings.helper";
import TrackDetailsSummary from "./components/TrackDetailsSummary";
import TrackRightsSummary from "./components/TrackRightsSummary";
import TrackAudioSummary from "./components/TrackAudioSummary";
import TrackContributorsSummary from "./components/TrackContributorsSummary";
import TrackLyricsSummary from "./components/TrackLyricsSummary";

const TrackDetailsPage = () => {
  const { id, trackId } = useParams<{ id: string; trackId: string }>();
  const navigate = useNavigate();
  const { getTrack } = useGetTrack();
  const { getRelease } = useGetRelease();
  const { track } = useAppSelector((state) => state.track);
  const { release } = useAppSelector((state) => state.release);

  useEffect(() => {
    if (trackId) getTrack({ id: trackId });
    if (id) getRelease({ id });
  }, [getTrack, getRelease, id, trackId]);

  return (
    <UserLayout variant="card">
      <main className="flex w-full flex-col gap-4">
        <motion.header
          className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <section className="space-y-1">
            <p className="text-xs text-(--muted)">
              Track details
            </p>
            <h1
              className="text-[18px] leading-tight text-(--ink)"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 500 }}
            >
              {track?.title || "Loading..."}
            </h1>
            {release?.title && (
              <p className="text-[13px] text-(--muted)">
                {release.title}
              </p>
            )}
          </section>
          {track?.status && (
            <span className={getStatusBackgroundColor(track.status)}>
              {capitalizeString(track.status)}
            </span>
          )}
        </motion.header>

        <article className="flex flex-col gap-4">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.35, ease: "easeOut" }}
          >
            <TrackDetailsSummary track={track} />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35, ease: "easeOut" }}
          >
            <TrackRightsSummary track={track} />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.35, ease: "easeOut" }}
          >
            <TrackAudioSummary track={track} />
          </motion.section>

          {trackId && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.35, ease: "easeOut" }}
            >
              <TrackContributorsSummary trackId={trackId} />
            </motion.section>
          )}

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.35, ease: "easeOut" }}
          >
            <TrackLyricsSummary track={track} />
          </motion.section>
        </article>

        <PageFooter
          back={
            <BackButton
              onClick={(event) => {
                event.preventDefault();
                if (id) {
                  navigate(`/releases/${id}/wizard`);
                } else {
                  navigate(-1);
                }
              }}
            >
              Back to release
            </BackButton>
          }
        />
      </main>
    </UserLayout>
  );
};

export default TrackDetailsPage;
