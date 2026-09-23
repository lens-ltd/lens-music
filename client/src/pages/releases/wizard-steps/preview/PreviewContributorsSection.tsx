import { useEffect } from "react";
import { motion } from "framer-motion";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/Table";
import DashboardSection from "@/pages/dashboard/components/DashboardSection";
import { useFetchReleaseContributors } from "@/hooks/releases/release-contributor.hooks";
import { ContributorRole, ReleaseContributor } from "@/types/models/releaseContributor.types";
import { capitalizeString, formatDate } from "@/utils/strings.helper";
import CustomPopover from "@/components/inputs/CustomPopover";
import TableActionButton from "@/components/inputs/TableActionButton";
import { ellipsisHClassName } from "@/constants/input.constants";
import { getContributorCreditName } from "@/utils/contributorCredit.helper";

import { LuEllipsis, LuInfo } from 'react-icons/lu';

interface PreviewContributorsSectionProps {
  releaseId: string;
  contributors?: ReleaseContributor[];
  isLoading?: boolean;
}

const columns: ColumnDef<ReleaseContributor, string>[] = [
  {
    accessorKey: "contributor",
    header: "Name",
    cell: ({ row }) => {
      const contributor = row.original.contributor;
      const isPrimaryArtist = row.original.role === ContributorRole.PRIMARY_ARTIST;
      return (
        <span
          className={`text-[13px] ${isPrimaryArtist ? "font-medium text-(--ink)" : "text-(--ink)"}`}
        >
          {getContributorCreditName(contributor, row.original.role)}
        </span>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const isPrimaryArtist = row.original.role === ContributorRole.PRIMARY_ARTIST;
      return (
        <span
          className={`rounded-md px-2 py-0.5 text-xs ${
            isPrimaryArtist
              ? "bg-(--signal-soft) font-medium text-(--signal)"
              : "bg-(--surface) text-(--ink)"
          }`}
        >
          {isPrimaryArtist ? "Primary Artist" : capitalizeString(row.original.role)}
        </span>
      );
    },
  },
  {
    accessorKey: `createdBy`,
    header: "Added By",
    cell: ({ row }) => {
      const createdBy = row.original.createdBy;
      return (
        <span className="text-[13px]">{createdBy?.name || "—"}</span>
      );
    },
  },
  {
      accessorKey: `updatedAt`,
      header: "Last Updated",
      cell: ({ row }) => {
        const updatedAt = row?.original?.updatedAt;
        return (
          <span className="text-[13px]">{formatDate(updatedAt, "DD/MM/YYYY HH:mm")}</span>
        );
      },
    },
    {
      accessorKey: `actions`,
      header: "Actions",
      cell: ({ row }) => {
        return (
          <CustomPopover trigger={<button type="button" className={ellipsisHClassName} aria-label="More actions"><LuEllipsis className="size-4" aria-hidden="true" /></button>}>
          <menu className="m-0 flex w-full flex-col gap-0.5 p-0">
            <TableActionButton icon={LuInfo} to={`/contributors/${row?.original?.contributor?.id}`}>
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
  contributors: contributorsFromProps,
  isLoading: isLoadingFromProps = false,
}: PreviewContributorsSectionProps) => {
  const { fetchReleaseContributors, data, isFetching } =
    useFetchReleaseContributors();

  useEffect(() => {
    if (!contributorsFromProps && releaseId) {
      fetchReleaseContributors({ releaseId });
    }
  }, [contributorsFromProps, fetchReleaseContributors, releaseId]);

  const contributors: ReleaseContributor[] = contributorsFromProps ?? data?.data ?? [];
  const contributorsAreLoading = contributorsFromProps ? isLoadingFromProps : isFetching;

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
            isLoading={contributorsAreLoading}
            data={contributors}
            showPagination={false}
          />
        ) : (
          <p className="text-[13px] text-(--muted)">
            No contributors added yet.
          </p>
        )}
      </DashboardSection>
    </motion.article>
  );
};

export default PreviewContributorsSection;
