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
          <p className="text-[13px] text-(--muted)">Loading labels...</p>
        ) : releaseLabels.length === 0 ? (
          <p className="text-[13px] text-(--muted)">
            No labels assigned yet.
          </p>
        ) : (
          <ul className="flex list-none flex-col gap-2 p-0">
            {releaseLabels.map((releaseLabel) => (
              <li
                key={releaseLabel.id}
                className="rounded-(--radius-control) bg-(--surface) p-3 text-[13px]"
              >
                <p className="font-medium text-(--ink)">
                  {releaseLabel.label?.name || "Unknown label"}
                </p>
                <p className="text-xs text-(--muted)">
                  {releaseLabel.type}
                  {releaseLabel.ownership
                    ? ` · Ownership: ${releaseLabel.ownership}`
                    : ""}
                </p>
                <p className="text-xs text-(--muted)">
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
