import { motion } from "framer-motion";
import { ColumnDef } from "@tanstack/react-table";
import DashboardSection from "@/pages/dashboard/components/DashboardSection";
import { Track } from "@/types/models/track.types";
import {
  capitalizeString,
  getStatusBackgroundColor,
} from "@/utils/strings.helper";
import { faCircleInfo, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import CustomPopover from "@/components/inputs/CustomPopover";
import { ellipsisHClassName } from "@/constants/input.constants";
import TableActionButton from "@/components/inputs/TableActionButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Table from "@/components/table/Table";

interface PreviewTracksSectionProps {
  tracks: Track[];
  releaseId: string;
  isLoading: boolean;
}

const formatDurationMs = (ms: number): string => {
  if (!ms) return "—";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const PreviewTracksSection = ({
  tracks,
  releaseId,
  isLoading,
}: PreviewTracksSectionProps) => {
  const columns: ColumnDef<Track, string>[] = [
    {
      accessorKey: "trackNumber",
      header: "#",
      cell: ({ row }) => (
        <span className="text-[12px] text-[color:var(--lens-ink)]/60">
          {row.original.trackNumber}
        </span>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="text-[12px] font-normal">
          {row.original.title}
          {row.original.titleVersion && (
            <span className="ml-1 text-[color:var(--lens-ink)]/45">
              ({row.original.titleVersion})
            </span>
          )}
        </span>
      ),
    },
    {
      accessorKey: "isrc",
      header: "ISRC",
      cell: ({ row }) => (
        <span className="text-[12px] text-[color:var(--lens-ink)]/60">
          {row.original.isrc || "—"}
        </span>
      ),
    },
    {
      accessorKey: "durationMs",
      header: "Duration",
      cell: ({ row }) => (
        <span className="text-[12px] text-[color:var(--lens-ink)]/60">
          {formatDurationMs(row.original.durationMs)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={getStatusBackgroundColor(row.original.status)}>
          {capitalizeString(row.original.status)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <CustomPopover
            trigger={
              <FontAwesomeIcon
                icon={faEllipsisH}
                className={ellipsisHClassName}
              />
            }
          >
            <menu className="w-full flex flex-col items-center gap-1">
              <TableActionButton
                icon={faCircleInfo}
                to={`/releases/${releaseId}/tracks/${row?.original?.id}`}
              >
                View details
              </TableActionButton>
            </menu>
          </CustomPopover>
        );
      },
    },
  ];

  const sortedTracks = [...tracks].sort(
    (a, b) => a.discNumber - b.discNumber || a.trackNumber - b.trackNumber,
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16, duration: 0.35, ease: "easeOut" }}
    >
      <DashboardSection title="Tracklist" label="Tracks">
        {sortedTracks.length > 0 ? (
          <Table
            isLoading={isLoading}
            columns={columns}
            data={sortedTracks}
            showPagination={false}
            containerClassName="border-0"
          />
        ) : (
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            No tracks added yet.
          </p>
        )}
      </DashboardSection>
    </motion.article>
  );
};

export default PreviewTracksSection;
