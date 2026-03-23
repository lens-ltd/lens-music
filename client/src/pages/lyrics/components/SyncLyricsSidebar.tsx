import Button from "@/components/inputs/Button";
import Combobox from "@/components/inputs/Combobox";
import type { SyncStateLine } from "@/hooks/lyrics/sync-lyrics.hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import type { Lyrics } from "@/types/models/lyrics.types";

type SyncLyricsSidebarProps = {
  lyricsRecords: Lyrics[];
  selectedLyricsId: string;
  onSelectLyrics: (value: string) => void;
  onDeleteLyrics: () => void;
  languageOptions: Array<{ label: string; value: string }>;
  editorLanguage: string;
  onChangeLanguage: (value: string) => void;
  plainTextLyrics: string;
  onChangePlainTextLyrics: (value: string) => void;
  onEditorKeyDown: (event: ReactKeyboardEvent<HTMLTextAreaElement>) => void;
  onOpenGuidelines: () => void;
  formatSyncLabel: (lyrics: Lyrics) => string;
  syncState: SyncStateLine[];
};

const SyncLyricsSidebar = ({
  lyricsRecords,
  selectedLyricsId,
  onSelectLyrics,
  onDeleteLyrics,
  languageOptions,
  editorLanguage,
  onChangeLanguage,
  plainTextLyrics,
  onChangePlainTextLyrics,
  onEditorKeyDown,
  onOpenGuidelines,
  formatSyncLabel,
  syncState,
}: SyncLyricsSidebarProps) => {
  return (
    <aside className="flex flex-col gap-4">
      <section className="rounded-md border border-[color:var(--lens-sand)]/70 bg-white p-4">
        <header className="space-y-1">
          <h2 className="text-sm font-normal text-[color:var(--lens-ink)]">
            Record selection
          </h2>
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            Multiple lyrics records can exist per track. Saving overwrites the
            currently selected record.
          </p>
        </header>

        <label className="mt-4 flex flex-col gap-2">
          <Combobox
            label="Lyrics record"
            options={lyricsRecords.map((lyrics) => ({
              label: formatSyncLabel(lyrics),
              value: lyrics.id,
            }))}
            value={selectedLyricsId}
            onChange={onSelectLyrics}
            readOnly={lyricsRecords.length === 0}
          />
        </label>

        {lyricsRecords.length > 0 && selectedLyricsId ? (
          <div className="mt-3">
            <Button
              danger
              icon={faTrash}
              onClick={(event) => {
                event.preventDefault();
                onDeleteLyrics();
              }}
            >
              Delete lyrics record
            </Button>
          </div>
        ) : null}

        <div className="mt-4">
          <Combobox
            label="Language"
            options={languageOptions}
            value={editorLanguage}
            onChange={onChangeLanguage}
            placeholder="Select language..."
          />
        </div>
      </section>

      <section className="rounded-md border border-[color:var(--lens-sand)]/70 bg-white p-4">
        <header className="space-y-1">
          <h2 className="text-sm font-normal text-[color:var(--lens-ink)]">
            Lyrics editor
          </h2>
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            Update the plain lyric lines here before syncing timestamps.
          </p>
        </header>

        <textarea
          value={plainTextLyrics}
          onChange={(event) => onChangePlainTextLyrics(event.target.value)}
          onKeyDown={onEditorKeyDown}
          rows={18}
          className="mt-4 w-full rounded-md border border-[color:var(--lens-sand)]/70 bg-[color:var(--lens-sand)]/10 p-3 text-[13px] text-[color:var(--lens-ink)] outline-hidden transition-colors focus:border-[color:var(--lens-blue)]"
          placeholder="Enter one lyric line per row"
        />

        <p className="mt-3 text-[12px] text-[color:var(--lens-ink)]/55">
          {syncState.length} editor line{syncState.length === 1 ? "" : "s"} ready
          for syncing.
        </p>
      </section>

      <Link
        to="#"
        onClick={(event) => {
          event.preventDefault();
          onOpenGuidelines();
        }}
        className="self-start text-[12px] text-[color:var(--lens-blue)] hover:underline underline-offset-2"
      >
        <FontAwesomeIcon icon={faBook} className="mr-1.5" />
        View lyrics guidelines
      </Link>
    </aside>
  );
};

export default SyncLyricsSidebar;
