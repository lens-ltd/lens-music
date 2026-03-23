import Button from "@/components/inputs/Button";
import type { Ref } from "react";
import type { SyncStateLine } from "@/hooks/lyrics/sync-lyrics.hooks";
import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";

type SyncLyricsLinesPanelProps = {
  lyricsRef: Ref<HTMLDivElement>;
  syncState: SyncStateLine[];
  currentLineIndex: number;
  isPlaying: boolean;
  onSetCurrentLineIndex: (index: number) => void;
  onSync: (index: number) => void;
  onResetLine: (index: number) => void;
  onResetPlayhead: () => void;
};

const SyncLyricsLinesPanel = ({
  lyricsRef,
  syncState,
  currentLineIndex,
  isPlaying,
  onSetCurrentLineIndex,
  onSync,
  onResetLine,
  onResetPlayhead,
}: SyncLyricsLinesPanelProps) => {
  return (
    <section className="rounded-md border border-[color:var(--lens-sand)]/70 bg-white p-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-normal text-[color:var(--lens-ink)]">
            Lyrics lines
          </h2>
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            Use ↑ and ↓ to move between lines, then press Space while the audio
            is playing to capture a timestamp.
          </p>
        </div>
        <Button
          icon={faArrowRotateLeft}
          onClick={(event) => {
            event.preventDefault();
            onResetPlayhead();
          }}
        >
          Reset playhead
        </Button>
      </header>

      <div
        ref={lyricsRef}
        className="mt-4 flex max-h-[65vh] flex-col gap-3 overflow-y-auto"
      >
        {syncState.map((line) => {
          const isActive = line.index === currentLineIndex;
          const isSynced = typeof line.time === "number";

          return (
            <section
              key={`${line.index}-${line.text}`}
              className={`rounded-md border p-3 transition-colors ${
                isActive
                  ? "border-[color:var(--lens-blue)] bg-[color:var(--lens-blue)]/5"
                  : "border-[color:var(--lens-sand)]/40 bg-[color:var(--lens-sand)]/10"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--lens-ink)]/50">
                    Line {line.index + 1}
                  </p>
                  <p
                    className={`text-sm ${isSynced ? "font-normal text-[color:var(--lens-ink)]" : "text-[color:var(--lens-ink)]/70"}`}
                  >
                    {line.text || (
                      <span className="italic text-[color:var(--lens-ink)]/40">
                        Blank line
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="min-w-16 text-right text-[11px] text-[color:var(--lens-blue)]">
                    {typeof line.time === "number"
                      ? `${line.time.toFixed(2)}s`
                      : "Not synced"}
                  </span>
                  <Button
                    onClick={(event) => {
                      event.preventDefault();
                      onSetCurrentLineIndex(line.index);
                      onSync(line.index);
                    }}
                    className="!text-[11px]"
                    disabled={!isPlaying}
                  >
                    Sync now
                  </Button>
                  <Button
                    onClick={(event) => {
                      event.preventDefault();
                      onResetLine(line.index);
                    }}
                    className="!text-[11px]"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
};

export default SyncLyricsLinesPanel;
