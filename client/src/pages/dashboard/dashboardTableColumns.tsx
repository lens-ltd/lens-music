import { ColumnDef } from "@tanstack/react-table";
import { DashboardBadge } from "./components/DashboardBadge";
import {
  getReleaseStatusTone,
  getTrackStatusTone,
} from "./dashboardBadge.utils";
import { RecentRelease, TopTrack } from "./dashboard.data";

export const topTrackColumns: ColumnDef<TopTrack>[] = [
  {
    accessorKey: "rank",
    header: "#",
    cell: ({ row }) => (
      <span className="w-8 text-[12px] font-normal text-[color:var(--lens-ink)]/25">
        {row.original.rank}
      </span>
    ),
  },
  {
    id: "track",
    header: "Track",
    cell: ({ row }) => (
      <div>
        <p className="text-[13px] font-normal leading-tight text-[color:var(--lens-ink)]">
          {row.original.title}
        </p>
        <p className="mt-0.5 text-[11px] text-[color:var(--lens-ink)]/45">
          {row.original.artist}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "streams",
    header: `Streams`,
    cell: ({ row }) => row.original.streams,
  },
  {
    accessorKey: "downloads",
    header: `Downloads`,
    cell: ({ row }) => row.original.downloads,
  },
  {
    accessorKey: "revenue",
    header: `Revenue`,
    cell: ({ row }) => row.original.revenue,
  },
  {
    accessorKey: "status",
    header: `Status`,
    cell: ({ row }) => (
      <DashboardBadge tone={getTrackStatusTone(row.original.status)}>
        {row.original.status}
      </DashboardBadge>
    ),
  },
];

export const recentReleaseColumns: ColumnDef<RecentRelease>[] = [
  {
    id: "titleArtist",
    header: "Title / Artist",
    cell: ({ row }) => (
      <div>
        <p className="text-[13px] font-normal leading-tight text-[color:var(--lens-ink)]">
          {row.original.title}
        </p>
        <p className="mt-0.5 text-[11px] text-[color:var(--lens-ink)]/45">
          {row.original.artist}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <DashboardBadge tone="outline">{row.original.type}</DashboardBadge>
    ),
  },
  {
    accessorKey: "releaseDate",
    header: "Release Date",
    cell: ({ row }) => (
      <span className="text-[12px] font-normal tabular-nums text-[color:var(--lens-ink)]/65">
        {row.original.releaseDate}
      </span>
    ),
  },
  {
    accessorKey: "stores",
    header: `Stores`,
    cell: ({ row }) => row.original.stores,
  },
  {
    accessorKey: "status",
    header: `Status`,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <DashboardBadge tone={getReleaseStatusTone(row.original.status)}>
          {row.original.status}
        </DashboardBadge>
      </div>
    ),
  },
];
