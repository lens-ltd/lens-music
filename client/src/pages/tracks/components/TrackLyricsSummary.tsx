import DashboardSection from "@/pages/dashboard/components/DashboardSection";
import { Track } from "@/types/models/track.types";
import { Lyrics } from "@/types/models/lyrics.types";

interface TrackLyricsSummaryProps {
  track?: Track;
}

const formatLyricsLabel = (lyrics: Lyrics) => {
  const createdAt = lyrics.createdAt
    ? new Date(lyrics.createdAt).toLocaleDateString()
    : "Draft";
  return `${lyrics.language.toUpperCase()} · ${createdAt}`;
};

const sortByNewest = (lyrics: Lyrics[]) =>
  [...lyrics].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

const TrackLyricsSummary = ({ track }: TrackLyricsSummaryProps) => {
  if (!track) return null;

  const lyrics = track.lyrics ?? [];

  return (
    <DashboardSection title="Lyrics" label="Text">
      {lyrics.length > 0 ? (
        <ul className="flex list-none flex-col gap-2 p-0">
          {sortByNewest(lyrics).map((lyric) => (
            <li
              key={lyric.id}
              className="flex items-center justify-between gap-3 rounded-md border border-[color:var(--lens-sand)]/70 p-3"
            >
              <p className="text-[12px] text-[color:var(--lens-ink)]">
                {formatLyricsLabel(lyric)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[12px] text-[color:var(--lens-ink)]/55">
          No lyrics records.
        </p>
      )}
    </DashboardSection>
  );
};

export default TrackLyricsSummary;
