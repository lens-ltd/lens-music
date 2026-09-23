import Button from "@/components/inputs/Button";
import Combobox from "@/components/inputs/Combobox";
import type { SyncStateLine } from "@/hooks/lyrics/sync-lyrics.hooks";
import { Link } from "react-router-dom";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import type { Lyrics } from "@/types/models/lyrics.types";

import { LuBook, LuTrash2 } from 'react-icons/lu';

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
      <section className="card-framed p-5">
        <header className="space-y-1">
          <h2 className="text-sm font-normal text-(--ink)">
            Record selection
          </h2>
          <p className="text-[13px] text-(--muted)">
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
              icon={LuTrash2}
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

      <section className="card-framed p-5">
        <header className="space-y-1">
          <h2 className="text-sm font-normal text-(--ink)">
            Lyrics editor
          </h2>
          <p className="text-[13px] text-(--muted)">
            Update the plain lyric lines here before syncing timestamps.
          </p>
        </header>

        <textarea
          value={plainTextLyrics}
          onChange={(event) => onChangePlainTextLyrics(event.target.value)}
          onKeyDown={onEditorKeyDown}
          rows={18}
          className="field-chrome mt-4 h-auto py-2"
          placeholder="Enter one lyric line per row"
        />

        <p className="mt-3 text-[13px] text-(--muted)">
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
        className="self-start text-[13px] text-(--signal) hover:underline underline-offset-2"
      >
        <LuBook className="mr-1.5" />
        View lyrics guidelines
      </Link>
    </aside>
  );
};

export default SyncLyricsSidebar;
