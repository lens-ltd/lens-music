import { RelaxedHeading } from "@/components/text/Headings";
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
  validationResult,
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

    {validationResult && (
      <aside
        className={`relative rounded-md border px-4 py-3 text-[12px] ${
          validationResult.valid
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-red-200 bg-red-50 text-red-700"
        }`}
        aria-live="polite"
        id="validation-result"
      >
        <RelaxedHeading className="font-normal text-[color:var(--lens-ink)]">
          {validationResult.valid
            ? "Track is complete."
            : "Track still needs a few required details."}
        </RelaxedHeading>
        {!validationResult.valid && (
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {validationResult.errors.map((error) => (
              <li
                className="text-[12px] text-[color:var(--lens-ink)]/80"
                key={error}
              >
                {error}
              </li>
            ))}
          </ul>
        )}
      </aside>
    )}
  </>
);

export default TrackEditorHeader;
