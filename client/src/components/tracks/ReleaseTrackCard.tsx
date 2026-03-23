import { Track } from "@/types/models/track.types";
import { capitalizeString } from "@/utils/strings.helper";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomTooltip from "../inputs/CustomTooltip";

export interface ReleaseTrackCardProps {
  isLoading?: boolean;
  track?: Track;
  onManage?: () => void;
}

const formatDuration = (durationMs?: number) => {
  if (!durationMs) return "0:00";

  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const ReleaseTrackCard = ({
  isLoading,
  track,
  onManage,
}: ReleaseTrackCardProps) => {
  if (isLoading) {
    return (
      <article className="w-full rounded-md bg-white/80 p-3 sm:p-3.5">
        <header className="flex items-start justify-between gap-3 pb-2">
          <section className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--lens-blue)] font-normal">
              Track
            </p>
            <p
              className="h-5 w-36 rounded-full bg-[color:var(--lens-sand)]/55"
              aria-hidden="true"
            />
          </section>
          <p
            className="h-5 w-16 rounded-full bg-[color:var(--lens-sand)]/55"
            aria-hidden="true"
          />
        </header>

        <section>
          <ul
            className="m-0 grid list-none gap-2 p-0 grid-cols-2 sm:grid-cols-4"
            aria-label="Track metadata preview"
          >
            {["Disc", "Track", "Duration", "Advisory"].map((label) => (
              <li
                key={label}
                className="rounded-lg bg-[color:var(--lens-sand)]/15 px-2.5 py-2"
              >
                <dl>
                  <dt className="text-[9px] uppercase tracking-[0.12em] text-[color:var(--lens-ink)]/50 font-normal">
                    {label}
                  </dt>
                  <dd
                    className="mt-1.5 h-4 w-12 rounded-full bg-[color:var(--lens-sand)]/55"
                    aria-hidden="true"
                  />
                </dl>
              </li>
            ))}
          </ul>
        </section>
      </article>
    );
  }

  const discNumber = track?.discNumber ?? 1;
  const secondaryLabels = [
    track?.isBonusTrack ? "Bonus track" : undefined,
    track?.isHiddenTrack ? "Hidden track" : undefined,
  ].filter(Boolean) as string[];

  return (
    <article className="w-full rounded-md shadow-md bg-white/70 p-3 sm:p-3.5">
      <header className="flex items-start justify-between gap-2 pb-2">
        <section className="min-w-0 space-y-1">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--lens-blue)] font-normal">
            {track?.trackNumber}. {track?.title}{" "}
            {track?.titleVersion ? `(${track.titleVersion})` : ""}
          </p>
          {secondaryLabels.length > 0 && (
            <ul
              className="flex list-none flex-wrap gap-1.5 p-0 m-0"
              aria-label="Track attributes"
            >
              {secondaryLabels.map((label) => (
                <li
                  key={label}
                  className="rounded-full border border-[color:var(--lens-sand)] bg-[color:var(--lens-sand)]/20 px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] text-[color:var(--lens-ink)]/70"
                >
                  {label}
                </li>
              ))}
            </ul>
          )}
        </section>

        <ul className="flex items-center gap-3 list-none flex-wrap gap-1.5 p-0 m-0">
          <section className="rounded-full border border-[color:var(--lens-sand)] bg-[color:var(--lens-sand)]/18 px-2.5 py-1">
            <p className="text-[9px] uppercase tracking-[0.12em] text-[color:var(--lens-ink)]/70 font-normal">
              {capitalizeString(track?.status)}
            </p>
          </section>
          {["DRAFT", 'VALIDATED'].includes(track?.status ?? "") && (
            <CustomTooltip label="Manage">
              <FontAwesomeIcon
                onClick={(e) => {
                  e.preventDefault();
                  onManage?.();
                }}
                className="text-primary text-[12px] cursor-pointer"
                icon={faPenToSquare}
              />
            </CustomTooltip>
          )}
        </ul>
      </header>

      <section>
        <ul
          className="m-0 grid list-none gap-2 p-0 grid-cols-2 sm:grid-cols-4"
          aria-label="Track metadata"
        >
          {["Disc", "Track", "Duration", "Advisory"].map((label) => (
            <li
              key={label}
              className="rounded-md bg-[color:var(--lens-sand)]/12 px-2.5 py-1"
            >
              <dl>
                <dt className="text-[9px] uppercase tracking-[0.12em] text-[color:var(--lens-ink)]/50 font-normal">
                  {label}
                </dt>
                <dd className="mt-0.5 text-[12px] text-[color:var(--lens-ink)] font-normal">
                  {label === "Disc"
                    ? discNumber
                    : label === "Track"
                      ? (track?.trackNumber ?? "Pending")
                      : label === "Duration"
                        ? formatDuration(track?.durationMs)
                        : capitalizeString(track?.parentalAdvisory)}
                </dd>
              </dl>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};

export default ReleaseTrackCard;
