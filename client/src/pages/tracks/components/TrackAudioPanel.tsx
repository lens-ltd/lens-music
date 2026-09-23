import Input from "@/components/inputs/Input";
import { capitalizeString } from "@/utils/strings.helper";
import { ChangeEvent } from "react";
import { Track } from "@/types/models/track.types";
import { formatDuration } from "./trackForm.helpers";
import type { TrackAudioUploadPhase } from "@/hooks/tracks/useTrackAudioUpload";
import TrackUploadProgress from "./TrackUploadProgress";
import Button from "@/components/inputs/Button";

import { LuAlignLeft, LuTrash2 } from 'react-icons/lu';
import { iconButtonDangerClassName } from '@/constants/input.constants';

import ExternalLink from '@/components/ui/ExternalLink';
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
    <section className="rounded-(--radius-card) bg-(--paper)">
      <header className="space-y-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-normal text-(--ink)">Audio</h2>
            <p className="text-[12px] text-(--muted)">
              Uploading a new file makes it the primary audio.
            </p>
          </div>
          {primaryAudio && onSyncLyrics && (
            <Button icon={LuAlignLeft} onClick={(event) => {
              event.preventDefault();
              onSyncLyrics();
            }}>
              Sync lyrics
            </Button>
          )}
        </div>
      </header>

      <dl className="mt-3 grid gap-2 rounded-md bg-(--surface) p-3">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-xs text-(--muted)">
            Duration
          </dt>
          <dd className="text-[12px] text-(--ink)">
            {formatDuration(track?.durationMs)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-xs text-(--muted)">
            Status
          </dt>
          <dd className="text-[12px] text-(--ink)">
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
          <p className="mt-2 text-[12px] text-(--muted)">
            Updating audio...
          </p>
        )}
      </fieldset>

      <ul className="mt-4 flex list-none flex-col gap-2 p-0">
        {track?.audioFiles?.length ? (
          track.audioFiles.map((audioFile) => (
            <li
              key={audioFile.id}
              className="rounded-(--radius-control) bg-(--surface) p-3"
            >
              <header className="flex items-start justify-between gap-3">
                <section className="space-y-1">
                  <p className="text-[12px] font-normal text-(--ink)">
                    {audioFile.fileType}
                  </p>
                  <p className="text-[11px] text-(--muted)">
                    {formatDuration(audioFile.durationMs)} ·{" "}
                    {audioFile.fileSizeBytes
                      ? `${Math.round(audioFile.fileSizeBytes / 1024 / 1024)} MB`
                      : "Size unavailable"}
                  </p>
                  {audioFile.isPrimary && (
                    <p className="text-[11px] text-(--signal)">
                      Primary audio
                    </p>
                  )}
                </section>
                <button
                  type="button"
                  aria-label="Delete"
                  className={iconButtonDangerClassName}
                  onClick={(e) => {
                    e.preventDefault();
                    void onDeleteAudio(audioFile.id);
                  }}
                >
                  <LuTrash2 className="size-4" aria-hidden="true" />
                </button>
              </header>
              <ExternalLink href={audioFile.storagePath} className="mt-2 text-[13px]">
                  Open file
                </ExternalLink>
            </li>
          ))
        ) : (
          <li className="rounded-(--radius-control) bg-(--surface) p-3 text-[12px] text-(--muted)">
            No audio uploaded yet.
          </li>
        )}
      </ul>
    </section>
  );
};

export default TrackAudioPanel;
