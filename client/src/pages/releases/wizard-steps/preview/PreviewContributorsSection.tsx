import { useEffect } from "react";
import { motion } from "framer-motion";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/Table";
import DashboardSection from "@/pages/dashboard/components/DashboardSection";
import { useFetchReleaseContributors } from "@/hooks/releases/release-contributor.hooks";
import { ReleaseContributor } from "@/types/models/releaseContributor.types";
import { capitalizeString, formatDate } from "@/utils/strings.helper";
import CustomPopover from "@/components/inputs/CustomPopover";
import { faCircleInfo, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableActionButton from "@/components/inputs/TableActionButton";
import { ellipsisHClassName } from "@/constants/input.constants";

interface PreviewContributorsSectionProps {
  releaseId: string;
}

const columns: ColumnDef<ReleaseContributor, string>[] = [
  {
    accessorKey: "contributor",
    header: "Name",
    cell: ({ row }) => {
      const contributor = row.original.contributor;
      return (
        <span className="text-[12px]">
          {contributor?.displayName || contributor?.name || contributor?.email || "—"}
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
  {
    accessorKey: `createdBy`,
    header: "Added By",
    cell: ({ row }) => {
      const createdBy = row.original.createdBy;
      return (
        <span className="text-[12px]">{createdBy?.name || "—"}</span>
      );
    },
  },
  {
      accessorKey: `updatedAt`,
      header: "Last Updated",
      cell: ({ row }) => {
        const updatedAt = row?.original?.updatedAt;
        return (
          <span className="text-[12px]">{formatDate(updatedAt, "DD/MM/YYYY HH:mm")}</span>
        );
      },
    },
    {
      accessorKey: `actions`,
      header: "Actions",
      cell: ({ row }) => {
        return (
          <CustomPopover trigger={<FontAwesomeIcon icon={faEllipsisH} className={ellipsisHClassName} />}>
          <menu className="w-full flex flex-col items-center gap-1">
            <TableActionButton icon={faCircleInfo} to={`/contributors/${row?.original?.contributor?.id}`}>
              View details
            </TableActionButton>
          </menu>
          </CustomPopover>
        );
      },
    }
];

const PreviewContributorsSection = ({
  releaseId,
}: PreviewContributorsSectionProps) => {
  const { fetchReleaseContributors, data, isFetching } =
    useFetchReleaseContributors();

  useEffect(() => {
    if (releaseId) {
      fetchReleaseContributors({ releaseId });
    }
  }, [fetchReleaseContributors, releaseId]);

  const contributors: ReleaseContributor[] = data?.data ?? [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.35, ease: "easeOut" }}
    >
      <DashboardSection title="Contributors" label="Credits">
        {contributors.length > 0 ? (
          <Table
            columns={columns}
            isLoading={isFetching}
            data={contributors}
            showPagination={false}
            containerClassName="border-0"
          />
        ) : (
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            No contributors added yet.
          </p>
        )}
      </DashboardSection>
    </motion.article>
  );
};

export default PreviewContributorsSection;
