import DashboardSection from "@/pages/dashboard/components/DashboardSection";
import { Track } from "@/types/models/track.types";
import { formatDuration } from "./trackForm.helpers";

import ExternalLink from '@/components/ui/ExternalLink';
interface TrackAudioSummaryProps {
  track?: Track;
}

const TrackAudioSummary = ({ track }: TrackAudioSummaryProps) => {
  if (!track) return null;

  const audioFiles = track.audioFiles ?? [];

  return (
    <DashboardSection title="Audio Files" label="Audio">
      {audioFiles.length > 0 ? (
        <ul className="flex list-none flex-col gap-2 p-0">
          {audioFiles.map((audioFile) => (
            <li
              key={audioFile.id}
              className="rounded-(--radius-control) bg-(--surface) p-3"
            >
              <header className="flex items-start justify-between gap-3">
                <section className="space-y-1">
                  <p className="text-[13px] font-normal text-(--ink)">
                    {audioFile.fileType}
                  </p>
                  <p className="text-xs text-(--muted)">
                    {formatDuration(audioFile.durationMs)} ·{" "}
                    {audioFile.fileSizeBytes
                      ? `${Math.round(audioFile.fileSizeBytes / 1024 / 1024)} MB`
                      : "Size unavailable"}
                  </p>
                  {audioFile.isPrimary && (
                    <p className="text-xs text-(--signal)">
                      Primary audio
                    </p>
                  )}
                </section>
              </header>
              {audioFile.storagePath && (
                <ExternalLink href={audioFile.storagePath} className="mt-2 text-[13px]">
                  Open file
                </ExternalLink>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[13px] text-(--muted)">
          No audio files uploaded.
        </p>
      )}
    </DashboardSection>
  );
};

export default TrackAudioSummary;
