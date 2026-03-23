import Input from "@/components/inputs/Input";
import { capitalizeString } from "@/utils/strings.helper";
import { ChangeEvent } from "react";
import { Track } from "@/types/models/track.types";
import { formatDuration } from "./trackForm.helpers";
import type { TrackAudioUploadPhase } from "@/hooks/tracks/useTrackAudioUpload";
import TrackUploadProgress from "./TrackUploadProgress";
import { faClosedCaptioning } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/inputs/Button";

type TrackAudioPanelProps = {
  track?: Track;
  isUploadingAudio: boolean;
  isDeletingAudio: boolean;
  uploadProgress: number;
  uploadPhase: TrackAudioUploadPhase;
  isUploadComplete: boolean;
  uploadFileName: string;
  onAudioUpload: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onDeleteAudio: (audioFileId: string) => Promise<void>;
  onSyncLyrics?: () => void;
};

const TrackAudioPanel = ({
  track,
  isUploadingAudio,
  isDeletingAudio,
  uploadProgress,
  uploadPhase,
  isUploadComplete,
  uploadFileName,
  onAudioUpload,
  onDeleteAudio,
  onSyncLyrics,
}: TrackAudioPanelProps) => {
  const primaryAudio =
    track?.audioFiles?.find((audioFile) => audioFile.isPrimary) ??
    track?.audioFiles?.[0];

  return (
    <section className="rounded-md border border-[color:var(--lens-sand)]/70 bg-white p-4">
      <header className="space-y-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-normal text-[color:var(--lens-ink)]">Audio</h2>
            <p className="text-[12px] text-[color:var(--lens-ink)]/55">
              Uploading a new file makes it the primary audio.
            </p>
          </div>
          {primaryAudio && onSyncLyrics && (
            <Button icon={faClosedCaptioning} onClick={(event) => {
              event.preventDefault();
              onSyncLyrics();
            }}>
              Sync lyrics
            </Button>
          )}
        </div>
      </header>

      <dl className="mt-3 grid gap-2 rounded-md bg-[color:var(--lens-sand)]/10 p-3">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--lens-ink)]/50">
            Duration
          </dt>
          <dd className="text-[12px] text-[color:var(--lens-ink)]">
            {formatDuration(track?.durationMs)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--lens-ink)]/50">
            Status
          </dt>
          <dd className="text-[12px] text-[color:var(--lens-ink)]">
            {capitalizeString(track?.status)}
          </dd>
        </div>
      </dl>

      <fieldset className="mt-4 border-none p-0">
        <Input
          type="file"
          label={track?.audioFiles?.length ? "Replace audio" : "Upload audio"}
          accept="audio/*"
          onChange={(event) => void onAudioUpload(event)}
          readOnly={isUploadingAudio}
        />
        <TrackUploadProgress
          progress={uploadProgress}
          phase={uploadPhase}
          isUploading={isUploadingAudio}
          isComplete={isUploadComplete}
          fileName={uploadFileName}
        />
        {isDeletingAudio && (
          <p className="mt-2 text-[12px] text-[color:var(--lens-ink)]/55">
            Updating audio...
          </p>
        )}
      </fieldset>

      <ul className="mt-4 flex list-none flex-col gap-2 p-0">
        {track?.audioFiles?.length ? (
          track.audioFiles.map((audioFile) => (
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
                <button
                  type="button"
                  onClick={() => void onDeleteAudio(audioFile.id)}
                  disabled={isDeletingAudio}
                  className="text-[12px] text-red-600 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Remove
                </button>
              </header>
              <a
                href={audioFile.storagePath}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex text-[12px] text-[color:var(--lens-blue)] hover:underline"
              >
                Open file
              </a>
            </li>
          ))
        ) : (
          <li className="rounded-md border border-dashed border-[color:var(--lens-sand)]/70 p-3 text-[12px] text-[color:var(--lens-ink)]/55">
            No audio uploaded yet.
          </li>
        )}
      </ul>
    </section>
  );
};

export default TrackAudioPanel;
