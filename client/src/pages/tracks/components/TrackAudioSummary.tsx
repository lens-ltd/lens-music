import DashboardSection from "@/pages/dashboard/components/DashboardSection";
import { Track } from "@/types/models/track.types";
import { formatDuration } from "./trackForm.helpers";

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
              className="rounded-md border border-[color:var(--lens-sand)]/70 p-3"
            >
              <header className="flex items-start justify-between gap-3">
                <section className="space-y-1">
                  <p className="text-[12px] font-normal text-[color:var(--lens-ink)]">
                    {audioFile.fileType}
                  </p>
                  <p className="text-[11px] text-[color:var(--lens-ink)]/55">
                    {formatDuration(audioFile.durationMs)} ·{" "}
                    {audioFile.fileSizeBytes
                      ? `${Math.round(audioFile.fileSizeBytes / 1024 / 1024)} MB`
                      : "Size unavailable"}
                  </p>
                  {audioFile.isPrimary && (
                    <p className="text-[11px] text-[color:var(--lens-blue)]">
                      Primary audio
                    </p>
                  )}
                </section>
              </header>
              {audioFile.storagePath && (
                <a
                  href={audioFile.storagePath}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex text-[12px] text-[color:var(--lens-blue)] hover:underline"
                >
                  Open file
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[12px] text-[color:var(--lens-ink)]/55">
          No audio files uploaded.
        </p>
      )}
    </DashboardSection>
  );
};

export default TrackAudioSummary;
