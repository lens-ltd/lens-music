import type { TrackAudioUploadPhase } from "@/hooks/tracks/useTrackAudioUpload";

import { LuCheck } from 'react-icons/lu';

type TrackUploadProgressProps = {
  progress: number;
  phase: TrackAudioUploadPhase;
  isUploading: boolean;
  isComplete: boolean;
  fileName: string;
};

const TrackUploadProgress = ({
  progress,
  phase,
  isUploading,
  isComplete,
  fileName,
}: TrackUploadProgressProps) => {
  if (!isUploading && !isComplete) return null;

  const statusLabel = isComplete
    ? null
    : phase === "registering"
      ? "Saving…"
      : `${progress}%`;

  return (
    <figure className="mt-3 rounded-md bg-(--surface) p-4">
      <figcaption className="flex items-center justify-between gap-3">
        <p className="text-[12px] text-(--ink) truncate">
          {fileName}
        </p>
        <output className="text-[12px] font-normal text-(--muted) shrink-0">
          {isComplete ? (
            <p className="flex text-[12px] font-normal items-center gap-1.5 bg-transparent text-(--success)">
              <LuCheck className="text-[11px]" />
              Uploaded
            </p>
          ) : (
            statusLabel
          )}
        </output>
      </figcaption>

      {phase === "registering" && !isComplete ? (
        <p className="mt-2 text-[11px] text-(--muted)">
          Saving file details…
        </p>
      ) : null}

      <progress
        value={progress}
        max={100}
        className={`mt-2 h-1.5 w-full appearance-none overflow-hidden rounded-full
          [&::-webkit-progress-bar]:rounded-full
          [&::-webkit-progress-bar]:bg-(--surface)
          [&::-webkit-progress-value]:rounded-full
          [&::-webkit-progress-value]:transition-all
          [&::-webkit-progress-value]:duration-300
          ${
            isComplete
              ? "[&::-webkit-progress-value]:bg-(--success) [&::-moz-progress-bar]:bg-(--success)"
              : "[&::-webkit-progress-value]:bg-(--signal) [&::-moz-progress-bar]:bg-(--signal)"
          }`}
      >
        {progress}%
      </progress>
    </figure>
  );
};

export default TrackUploadProgress;
