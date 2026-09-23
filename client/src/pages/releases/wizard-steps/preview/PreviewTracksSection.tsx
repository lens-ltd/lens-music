import { motion } from "framer-motion";
import { ColumnDef } from "@tanstack/react-table";
import DashboardSection from "@/pages/dashboard/components/DashboardSection";
import { Track } from "@/types/models/track.types";
import {
  capitalizeString,
  getStatusBackgroundColor,
} from "@/utils/strings.helper";
import CustomPopover from "@/components/inputs/CustomPopover";
import { ellipsisHClassName } from "@/constants/input.constants";
import TableActionButton from "@/components/inputs/TableActionButton";
import Table from "@/components/table/Table";

import { LuEllipsis, LuInfo } from 'react-icons/lu';

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
        <span className="text-[13px] text-(--muted)">
          {row.original.trackNumber}
        </span>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="text-[13px] font-normal">
          {row.original.title}
          {row.original.titleVersion && (
            <span className="ml-1 text-(--muted)">
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
        <span className="text-[13px] text-(--muted)">
          {row.original.isrc || "—"}
        </span>
      ),
    },
    {
      accessorKey: "durationMs",
      header: "Duration",
      cell: ({ row }) => (
        <span className="text-[13px] text-(--muted)">
          {formatDurationMs(row.original.durationMs)}
        </span>
      ),
    },
    {
      accessorKey: "soundRecordingType",
      header: "Sound Recording",
      cell: ({ row }) => (
        <span className="text-[13px] text-(--muted)">
          {row.original.soundRecordingType
            ? capitalizeString(
                row.original.soundRecordingType.replace(/_/g, " ").toLowerCase(),
              )
            : "—"}
        </span>
      ),
    },
    {
      accessorKey: "previewDurationMs",
      header: "Preview",
      cell: ({ row }) => (
        <span className="text-[13px] text-(--muted)">
          {row.original.previewDurationMs
            ? formatDurationMs(row.original.previewDurationMs)
            : "—"}
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
              <button type="button" className={ellipsisHClassName} aria-label="More actions"><LuEllipsis className="size-4" aria-hidden="true" /></button>
            }
          >
            <menu className="m-0 flex w-full flex-col gap-0.5 p-0">
              <TableActionButton
                icon={LuInfo}
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
            size={sortedTracks?.length}
          />
        ) : (
          <p className="text-[13px] text-(--muted)">
            No tracks added yet.
          </p>
        )}
      </DashboardSection>
    </motion.article>
  );
};

export default PreviewTracksSection;
