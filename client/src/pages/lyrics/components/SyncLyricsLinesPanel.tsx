import Button from "@/components/inputs/Button";
import type { Ref } from "react";
import type { SyncStateLine } from "@/hooks/lyrics/sync-lyrics.hooks";

import { LuRotateCcw } from 'react-icons/lu';

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
    <section className="card-framed p-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-normal text-(--ink)">
            Lyrics lines
          </h2>
          <p className="text-[13px] text-(--muted)">
            Use ↑ and ↓ to move between lines, then press Space while the audio
            is playing to capture a timestamp.
          </p>
        </div>
        <Button
          icon={LuRotateCcw}
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
              key={line.index}
              className={`rounded-(--radius-control) p-3 transition-colors ${
                isActive
                  ? "bg-(--signal-soft)"
                  : "bg-(--surface)"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-(--muted)">
                    Line {line.index + 1}
                  </p>
                  <p
                    className={`text-sm ${isSynced ? "font-normal text-(--ink)" : "text-(--muted)"}`}
                  >
                    {line.text || (
                      <span className="italic text-(--muted)">
                        Blank line
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="min-w-16 text-right text-xs text-(--signal)">
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
                    className="!text-xs"
                    disabled={!isPlaying}
                  >
                    Sync now
                  </Button>
                  <Button
                    onClick={(event) => {
                      event.preventDefault();
                      onResetLine(line.index);
                    }}
                    className="!text-xs"
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
