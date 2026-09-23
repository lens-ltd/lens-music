import type { AudioFile } from "@/types/models/track.types";

type SyncLyricsAudioPanelProps = {
  primaryAudio: AudioFile;
  audioRef: (node: HTMLAudioElement | null) => void;
  currentTime: number;
  currentLineIndex: number;
  syncedLinesCount: number;
  totalLines: number;
};

const SyncLyricsAudioPanel = ({
  primaryAudio,
  audioRef,
  currentTime,
  currentLineIndex,
  syncedLinesCount,
  totalLines,
}: SyncLyricsAudioPanelProps) => {
  return (
    <section className="card-framed p-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-normal text-(--ink)">
            Audio reference
          </h2>
          <p className="text-[13px] text-(--muted)">
            Primary uploaded audio · {primaryAudio.fileType}
          </p>
        </div>
        <p className="text-[13px] text-(--muted)">
          Use the native audio controls to play and pause the track.
        </p>
      </header>

      <audio
        ref={audioRef}
        src={primaryAudio.storagePath}
        preload="metadata"
        className="mt-4 w-full"
        controls
      />

      <dl className="mt-4 grid gap-3 rounded-md bg-(--surface) p-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <dt className="text-xs text-(--muted)">
            Current time
          </dt>
          <dd className="text-sm text-(--ink)">
            {currentTime.toFixed(2)}s
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs text-(--muted)">
            Active line
          </dt>
          <dd className="text-sm text-(--ink)">
            {currentLineIndex + 1}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs text-(--muted)">
            Synced lines
          </dt>
          <dd className="text-sm text-(--ink)">
            {syncedLinesCount} / {totalLines}
          </dd>
        </div>
      </dl>
    </section>
  );
};

export default SyncLyricsAudioPanel;
