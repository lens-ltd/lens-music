import { useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/Table";
import DashboardSection from "@/pages/dashboard/components/DashboardSection";
import { useFetchTrackContributors } from "@/hooks/tracks/track-contributor.hooks";
import { TrackContributor } from "@/types/models/track.types";
import { capitalizeString } from "@/utils/strings.helper";

interface TrackContributorsSummaryProps {
  trackId: string;
}

const columns: ColumnDef<TrackContributor, string>[] = [
  {
    accessorKey: "contributor",
    header: "Name",
    cell: ({ row }) => {
      const contributor = row.original.contributor;
      return (
        <span className="text-[12px]">
          {contributor?.displayName || contributor?.name || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <span className="rounded-full border border-[color:var(--lens-sand)] px-2 py-0.5 text-[11px]">
        {capitalizeString(row.original.role)}
      </span>
    ),
  },
];

const TrackContributorsSummary = ({
  trackId,
}: TrackContributorsSummaryProps) => {
  const { fetchTrackContributors, data, isFetching } =
    useFetchTrackContributors();

  useEffect(() => {
    if (trackId) {
      fetchTrackContributors({ trackId });
    }
  }, [fetchTrackContributors, trackId]);

  const contributors: TrackContributor[] = data?.data ?? [];

  return (
    <DashboardSection title="Contributors" label="Credits">
      {contributors.length > 0 ? (
        <Table
          columns={columns}
          data={contributors}
          showPagination={false}
          isLoading={isFetching}
          containerClassName="border-0"
        />
      ) : (
        <p className="text-[12px] text-[color:var(--lens-ink)]/55">
          No contributors added.
        </p>
      )}
    </DashboardSection>
  );
};

export default TrackContributorsSummary;
