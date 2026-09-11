import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { TrackAudioUploadPhase } from "@/hooks/tracks/useTrackAudioUpload";

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
    <figure className="mt-3 rounded-md border border-(--line)/70 bg-(--surface) p-4">
      <figcaption className="flex items-center justify-between gap-3">
        <p className="text-[12px] text-(--ink) truncate">
          {fileName}
        </p>
        <output className="text-[12px] font-normal text-(--ink)/70 shrink-0">
          {isComplete ? (
            <p className="flex text-[12px] font-normal items-center gap-1.5 bg-transparent text-green-700">
              <FontAwesomeIcon icon={faCheck} className="text-[11px]" />
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
              ? "[&::-webkit-progress-value]:bg-green-700 [&::-moz-progress-bar]:bg-green-700"
              : "[&::-webkit-progress-value]:bg-(--lens-blue) [&::-moz-progress-bar]:bg-(--lens-blue)"
          }`}
      >
        {progress}%
      </progress>
    </figure>
  );
};

export default TrackUploadProgress;
