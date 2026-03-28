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
    <section className="rounded-md border border-[color:var(--lens-sand)]/70 bg-white p-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-normal text-[color:var(--lens-ink)]">
            Audio reference
          </h2>
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            Primary uploaded audio · {primaryAudio.fileType}
          </p>
        </div>
        <p className="text-[12px] text-[color:var(--lens-ink)]/55">
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

      <dl className="mt-4 grid gap-3 rounded-md bg-[color:var(--lens-sand)]/10 p-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <dt className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--lens-ink)]/50">
            Current time
          </dt>
          <dd className="text-sm text-[color:var(--lens-ink)]">
            {currentTime.toFixed(2)}s
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--lens-ink)]/50">
            Active line
          </dt>
          <dd className="text-sm text-[color:var(--lens-ink)]">
            {currentLineIndex + 1}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--lens-ink)]/50">
            Synced lines
          </dt>
          <dd className="text-sm text-[color:var(--lens-ink)]">
            {syncedLinesCount} / {totalLines}
          </dd>
        </div>
      </dl>
    </section>
  );
};

export default SyncLyricsAudioPanel;
