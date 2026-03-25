import { useEffect } from "react";
import { motion } from "framer-motion";
import DashboardSection from "@/pages/dashboard/components/DashboardSection";
import { COUNTRIES_LIST } from "@/constants/countries.constants";
import { useFetchReleaseTerritoryDetails } from "@/hooks/releases/release-territory-detail.hooks";
import { ReleaseTerritoryDetail } from "@/types/models/releaseTerritoryDetail.types";

const PreviewTerritoryDetailsSection = ({ releaseId }: { releaseId: string }) => {
  const { fetchReleaseTerritoryDetails, data, isFetching } =
    useFetchReleaseTerritoryDetails();

  useEffect(() => {
    if (releaseId) {
      fetchReleaseTerritoryDetails({ releaseId });
    }
  }, [fetchReleaseTerritoryDetails, releaseId]);

  const details: ReleaseTerritoryDetail[] = data?.data ?? [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.24, duration: 0.35, ease: "easeOut" }}
    >
      <DashboardSection title="Territory Overrides" label="Metadata">
        {isFetching ? (
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            Loading territory overrides...
          </p>
        ) : details.length === 0 ? (
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            No territory-specific overrides configured.
          </p>
        ) : (
          <ul className="flex list-none flex-col gap-2 p-0">
            {details.map((detail) => {
              const countryName =
                COUNTRIES_LIST.find((country) => country.code === detail.territory)
                  ?.name || detail.territory;
              return (
                <li
                  key={detail.id}
                  className="rounded-md border border-[color:var(--lens-sand)]/50 p-3 text-[12px]"
                >
                  <p className="font-medium text-[color:var(--lens-ink)]">
                    {countryName}
                  </p>
                  <p className="text-[11px] text-[color:var(--lens-ink)]/55">
                    Title: {detail.title || "Default"} · Artist:{" "}
                    {detail.displayArtistName || "Default"} · Label:{" "}
                    {detail.labelName || "Default"}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </DashboardSection>
    </motion.article>
  );
};

export default PreviewTerritoryDetailsSection;
