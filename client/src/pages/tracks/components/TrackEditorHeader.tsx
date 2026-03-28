import { Release } from "@/types/models/release.types";
import { Track } from "@/types/models/track.types";
import { ValidationResult } from "./trackForm.helpers";

type TrackEditorHeaderProps = {
  track?: Track;
  release?: Release;
  validationResult: ValidationResult | null;
};

const TrackEditorHeader = ({
  track,
  release,
}: TrackEditorHeaderProps) => (
  <>
    <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <section className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--lens-blue)]">
          Track editor
        </p>
        <h1 className="text-lg font-normal text-[color:var(--lens-ink)]">
          {track?.title || "Manage track"}
        </h1>
        {release?.title && (
          <p className="text-[12px] text-[color:var(--lens-ink)]/60">
            {release.title}
          </p>
        )}
      </section>
    </header>
  </>
);

export default TrackEditorHeader;
