import { Track } from "@/types/models/track.types";
import { capitalizeString } from "@/utils/strings.helper";
import CustomTooltip from "../inputs/CustomTooltip";

import { LuSquarePen, LuTrash2 } from 'react-icons/lu';
import { Icon } from '@/components/ui/icon';
import { iconButtonClassName } from '@/constants/input.constants';

export interface ReleaseTrackCardProps {
  isLoading?: boolean;
  track?: Track;
  onManage?: () => void;
  canDelete?: boolean;
  onDelete?: () => void;
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
  canDelete,
  onDelete,
}: ReleaseTrackCardProps) => {
  if (isLoading) {
    return (
      <article className="w-full rounded-(--radius-control) bg-(--paper) p-3 sm:p-3.5">
        <header className="flex items-start justify-between gap-3 pb-2">
          <section className="space-y-1">
            <p className="text-xs text-(--muted) font-normal">
              Track
            </p>
            <p
              className="h-5 w-36 rounded-full bg-(--surface)"
              aria-hidden="true"
            />
          </section>
          <p
            className="h-5 w-16 rounded-full bg-(--surface)"
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
                className="rounded-lg bg-(--surface) px-2.5 py-2"
              >
                <dl>
                  <dt className="text-xs text-(--muted) font-normal">
                    {label}
                  </dt>
                  <dd
                    className="mt-1.5 h-4 w-12 rounded-full bg-(--surface)"
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
    <article className="w-full rounded-(--radius-control) bg-(--paper) p-3 sm:p-3.5">
      <header className="flex items-start justify-between gap-2 pb-2">
        <section className="min-w-0 space-y-1">
          <p className="text-xs text-(--muted) font-normal">
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
                  className="rounded-full bg-(--surface) px-2 py-0.5 text-xs text-(--muted)"
                >
                  {label}
                </li>
              ))}
            </ul>
          )}
        </section>

        <ul className="flex items-center gap-3 list-none flex-wrap gap-1.5 p-0 m-0">
          <section className="rounded-full bg-(--surface) px-2.5 py-1">
            <p className="text-xs text-(--muted) font-normal">
              {capitalizeString(track?.status)}
            </p>
          </section>
          {["DRAFT", 'VALIDATED'].includes(track?.status ?? "") && (
            <CustomTooltip label="Manage">
              <button
                type="button"
                aria-label="Edit"
                className={iconButtonClassName}
                onClick={(e) => {
                  e.preventDefault();
                  onManage?.();
                }}
              >
                <Icon icon={LuSquarePen} className="size-4" aria-hidden="true" />
              </button>
            </CustomTooltip>
          )}
          {canDelete && (
            <CustomTooltip label="Delete">
              <button
                type="button"
                aria-label={`Delete ${track?.title ?? "track"}`}
                onClick={(e) => {
                  e.preventDefault();
                  onDelete?.();
                }}
                className="cursor-pointer border-0 bg-transparent p-0 text-(--danger)"
              >
                <LuTrash2 className="text-[13px]" />
              </button>
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
            <li key={label}>
              <dl>
                <dt className="text-xs text-(--muted) font-normal">
                  {label}
                </dt>
                <dd className="mt-0.5 text-[13px] text-(--ink) font-normal">
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
