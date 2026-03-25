import { useEffect } from "react";
import { motion } from "framer-motion";
import DashboardSection from "@/pages/dashboard/components/DashboardSection";
import { useFetchRelatedReleases } from "@/hooks/releases/related-release.hooks";
import { RelatedRelease } from "@/types/models/relatedRelease.types";

const PreviewRelatedReleasesSection = ({ releaseId }: { releaseId: string }) => {
  const { fetchRelatedReleases, data, isFetching } = useFetchRelatedReleases();

  useEffect(() => {
    if (releaseId) {
      fetchRelatedReleases({ releaseId });
    }
  }, [fetchRelatedReleases, releaseId]);

  const relatedReleases: RelatedRelease[] = data?.data ?? [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22, duration: 0.35, ease: "easeOut" }}
    >
      <DashboardSection title="Related Releases" label="Metadata">
        {isFetching ? (
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            Loading related releases...
          </p>
        ) : relatedReleases.length === 0 ? (
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            No related releases linked.
          </p>
        ) : (
          <ul className="flex list-none flex-col gap-2 p-0">
            {relatedReleases.map((row) => (
              <li
                key={row.id}
                className="rounded-md border border-[color:var(--lens-sand)]/50 p-3 text-[12px]"
              >
                <p className="font-medium text-[color:var(--lens-ink)]">
                  {row.relatedRelease?.title || row.externalId || "External release"}
                </p>
                <p className="text-[11px] text-[color:var(--lens-ink)]/55">
                  {row.relationType}
                </p>
              </li>
            ))}
          </ul>
        )}
      </DashboardSection>
    </motion.article>
  );
};

export default PreviewRelatedReleasesSection;
