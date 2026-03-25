import { useEffect } from "react";
import { motion } from "framer-motion";
import DashboardSection from "@/pages/dashboard/components/DashboardSection";
import { useFetchReleaseLabels } from "@/hooks/releases/release-label.hooks";
import { ReleaseLabel } from "@/types/models/releaseLabel.types";

const PreviewLabelsSection = ({ releaseId }: { releaseId: string }) => {
  const { fetchReleaseLabels, data, isFetching } = useFetchReleaseLabels();

  useEffect(() => {
    if (releaseId) {
      fetchReleaseLabels({ releaseId });
    }
  }, [fetchReleaseLabels, releaseId]);

  const releaseLabels: ReleaseLabel[] = data?.data ?? [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.35, ease: "easeOut" }}
    >
      <DashboardSection title="Labels" label="Distribution">
        {isFetching ? (
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">Loading labels...</p>
        ) : releaseLabels.length === 0 ? (
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            No labels assigned yet.
          </p>
        ) : (
          <ul className="flex list-none flex-col gap-2 p-0">
            {releaseLabels.map((releaseLabel) => (
              <li
                key={releaseLabel.id}
                className="rounded-md border border-[color:var(--lens-sand)]/50 p-3 text-[12px]"
              >
                <p className="font-medium text-[color:var(--lens-ink)]">
                  {releaseLabel.label?.name || "Unknown label"}
                </p>
                <p className="text-[11px] text-[color:var(--lens-ink)]/55">
                  {releaseLabel.type}
                  {releaseLabel.ownership
                    ? ` · Ownership: ${releaseLabel.ownership}`
                    : ""}
                </p>
                <p className="text-[11px] text-[color:var(--lens-ink)]/55">
                  DDEX Party ID: {releaseLabel.label?.ddexPartyId || "Missing"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </DashboardSection>
    </motion.article>
  );
};

export default PreviewLabelsSection;
