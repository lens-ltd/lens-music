import Button from "@/components/inputs/Button";
import { Heading, RelaxedHeading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import {
  formatSyncLabel,
  languageOptions,
  useSyncLyricsPage,
  useSyncLyricsPlayback,
} from "@/hooks/lyrics/sync-lyrics.hooks";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import DeleteLyrics from "./DeleteLyrics";
import LyricsGuidelines from "./LyricsGuidelines";
import SyncLyricsAudioPanel from "./components/SyncLyricsAudioPanel";
import SyncLyricsEmptyState from "./components/SyncLyricsEmptyState";
import SyncLyricsFooter from "./components/SyncLyricsFooter";
import SyncLyricsLinesPanel from "./components/SyncLyricsLinesPanel";
import SyncLyricsSidebar from "./components/SyncLyricsSidebar";

const SyncLyrics = () => {
  const navigate = useNavigate();
  const playback = useSyncLyricsPlayback();
  const page = useSyncLyricsPage({
    syncState: playback.syncState,
    hydrateSyncState: playback.hydrateSyncState,
    clearSyncState: playback.clearSyncState,
  });

  if (!page.trackId) {
    return (
      <UserLayout>
        <main className="flex w-full flex-col gap-4">
          <SyncLyricsEmptyState
            title="Track required"
            description="Open lyrics sync from a track page so the editor can load the uploaded primary audio."
            actionLabel="Go back"
            onAction={() => navigate(-1)}
          />
        </main>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <main className="flex w-full flex-col gap-4">
        <header className="rounded-md border border-[color:var(--lens-sand)]/70 bg-white p-4">
          <nav className="flex flex-wrap items-start justify-between gap-4">
            <menu className="space-y-1">
              <RelaxedHeading>Lyrics sync</RelaxedHeading>
              <Heading className="!text-[color:var(--lens-ink)]">
                {page.track?.title || "Track lyrics sync"}
              </Heading>
              <p className="text-[12px] text-[color:var(--lens-ink)]/55">
                Sync lyrics against the uploaded primary audio and overwrite the
                selected lyrics record when you save.
              </p>
            </menu>
            <menu className="flex flex-wrap items-center gap-2">
              <Button
                icon={faPlus}
                route={`/lyrics/create?trackId=${page.trackId}`}
              >
                New lyrics record
              </Button>
            </menu>
          </nav>
        </header>

        {!page.primaryAudio ? (
          <SyncLyricsEmptyState
            title="Primary audio required"
            description="Upload track audio before syncing lyrics. The sync timeline uses the track's uploaded primary audio source."
            actionLabel="Back to track editor"
            actionRoute={`/releases/${page.track?.releaseId}/manage-tracks/${page.trackId}`}
          />
        ) : (
          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.75fr)_360px]">
            <article className="flex flex-col gap-4">
              <SyncLyricsAudioPanel
                primaryAudio={page.primaryAudio}
                audioRef={playback.audioRef}
                currentTime={playback.currentTime}
                currentLineIndex={playback.currentLineIndex}
                syncedLinesCount={
                  playback.syncState.filter(
                    (line) => typeof line.time === "number",
                  ).length
                }
                totalLines={playback.syncState.length}
              />

              <SyncLyricsLinesPanel
                lyricsRef={playback.lyricsRef}
                syncState={playback.syncState}
                currentLineIndex={playback.currentLineIndex}
                isPlaying={playback.isPlaying}
                onSetCurrentLineIndex={playback.setCurrentLineIndex}
                onSync={playback.handleSync}
                onResetLine={playback.handleResetLine}
                onResetPlayhead={playback.resetPlayhead}
              />
            </article>

            <SyncLyricsSidebar
              lyricsRecords={page.lyricsRecords}
              selectedLyricsId={page.selectedLyricsId}
              onSelectLyrics={page.handleSelectLyrics}
              onDeleteLyrics={page.openDeleteModal}
              languageOptions={languageOptions}
              editorLanguage={page.editorLanguage}
              onChangeLanguage={page.setEditorLanguage}
              plainTextLyrics={playback.plainTextLyrics}
              onChangePlainTextLyrics={playback.setPlainTextLyrics}
              onEditorKeyDown={playback.handleEditorKeyDown}
              onOpenGuidelines={page.openGuidelinesModal}
              formatSyncLabel={formatSyncLabel}
              syncState={playback.syncState}
            />
          </section>
        )}

        <SyncLyricsFooter
          isBusy={page.isBusy}
          onBack={() => navigate(-1)}
          onSave={() => void page.handleSave()}
        />
      </main>

      <LyricsGuidelines />
      <DeleteLyrics />
    </UserLayout>
  );
};

export default SyncLyrics;
