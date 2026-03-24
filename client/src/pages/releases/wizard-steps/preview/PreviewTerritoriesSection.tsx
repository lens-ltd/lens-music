import { motion } from "framer-motion";
import DashboardSection from "@/pages/dashboard/components/DashboardSection";
import { COUNTRIES_LIST } from "@/constants/countries.constants";

interface PreviewTerritoriesSectionProps {
  territories: string[];
}

const getCountryName = (code: string): string => {
  const country = COUNTRIES_LIST.find(
    (c) => c.code.toUpperCase() === code.toUpperCase(),
  );
  return country?.name ?? code;
};

const PreviewTerritoriesSection = ({
  territories,
}: PreviewTerritoriesSectionProps) => {
  const isWorldwide = territories.length >= COUNTRIES_LIST.length;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.24, duration: 0.35, ease: "easeOut" }}
    >
      <DashboardSection title="Territories" label="Distribution">
        {territories.length > 0 ? (
          <section>
            <p className="text-[12px] text-[color:var(--lens-ink)]/70">
              {isWorldwide ? (
                <span className="rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-[11px] font-normal text-green-900">
                  Worldwide
                </span>
              ) : (
                <span className="text-[12px] text-[color:var(--lens-ink)]/70">
                  {territories.length} territor{territories.length === 1 ? "y" : "ies"} selected
                </span>
              )}
            </p>
            {!isWorldwide && (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {territories.map((code) => (
                  <li
                    key={code}
                    className="rounded-full border border-[color:var(--lens-sand)] bg-[color:var(--lens-sand)]/20 px-2.5 py-0.5 text-[11px] text-[color:var(--lens-ink)]/70"
                  >
                    {getCountryName(code)}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            No territories selected.
          </p>
        )}
      </DashboardSection>
    </motion.article>
  );
};

export default PreviewTerritoriesSection;
