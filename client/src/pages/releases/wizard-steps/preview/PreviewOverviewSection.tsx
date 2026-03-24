import { motion } from "framer-motion";
import Input from "@/components/inputs/Input";
import DashboardSection from "@/pages/dashboard/components/DashboardSection";
import { ContributorRole, ReleaseContributor } from "@/types/models/releaseContributor.types";
import { Release } from "@/types/models/release.types";
import { capitalizeString, formatDate } from "@/utils/strings.helper";

interface PreviewOverviewSectionProps {
  release: Release;
  contributors?: ReleaseContributor[];
}

const getContributorName = (contributor?: ReleaseContributor["contributor"]) =>
  contributor?.displayName || contributor?.name || contributor?.email || "";

const PreviewOverviewSection = ({
  release,
  contributors = [],
}: PreviewOverviewSectionProps) => {
  const primaryArtists = contributors
    .filter((contributor) => contributor.role === ContributorRole.PRIMARY_ARTIST)
    .map((contributor) => getContributorName(contributor.contributor))
    .filter(Boolean);

  const featuredArtists = contributors
    .filter((contributor) => contributor.role === ContributorRole.FEATURED_ARTIST)
    .map((contributor) => getContributorName(contributor.contributor))
    .filter(Boolean);

  const displayArtist =
    primaryArtists.length > 0
      ? `${primaryArtists.join(", ")}${featuredArtists.length > 0 ? ` feat. ${featuredArtists.join(", ")}` : ""}`
      : "—";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <DashboardSection title="Release Overview" label="Metadata">
        <section className="flex flex-col gap-5 sm:flex-row">
          {release.coverArtUrl ? (
            <figure className="shrink-0">
              <img
                src={release.coverArtUrl}
                alt={`${release.title} cover art`}
                className="h-40 w-40 rounded-lg border border-[color:var(--lens-sand)] object-cover"
              />
              <figcaption className="mt-2 max-w-[160px] truncate text-[11px] text-[color:var(--lens-ink)]/55">
                {release.title}
              </figcaption>
            </figure>
          ) : (
            <figure className="flex h-40 w-40 shrink-0 items-center justify-center rounded-lg border border-dashed border-[color:var(--lens-sand)] bg-[color:var(--lens-sand)]/20">
              <figcaption className="text-[11px] text-[color:var(--lens-ink)]/40">
                No cover art
              </figcaption>
            </figure>
          )}

          <section className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Input label="Title" value={release.title || ""} readOnly />
            <Input label="Display Artist" value={displayArtist} readOnly />
            <Input label="Title Version" value={release.titleVersion || "—"} readOnly />
            <Input label="Type" value={capitalizeString(release.type) || "—"} readOnly />
            <Input label="Language" value={release.primaryLanguage?.toUpperCase() || "—"} readOnly />
            <Input label="Parental Advisory" value={capitalizeString(release.parentalAdvisory) || "—"} readOnly />
            <Input label="Production Year" value={release.productionYear || "—"} readOnly />
            <Input label="Original Release Date" value={formatDate(release.originalReleaseDate) || "—"} readOnly />
            <Input label="Digital Release Date" value={formatDate(release.digitalReleaseDate) || "—"} readOnly />
            <Input label="Preorder Date" value={formatDate(release.preorderDate) || "—"} readOnly />
            <Input label="Catalog Number" value={release.catalogNumber || "—"} readOnly />
            <Input label="UPC" value={release.upc || "—"} readOnly />
          </section>
        </section>

        <fieldset className="mt-4 grid grid-cols-1 gap-3 border-t border-[color:var(--lens-sand)]/50 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <legend className="sr-only">Rights Lines</legend>
          <Input label="C-Line Year" value={release.cLine?.year || "—"} readOnly />
          <Input label="C-Line Owner" value={release.cLine?.owner || "—"} readOnly />
          <Input label="P-Line Year" value={release.pLine?.year || "—"} readOnly />
          <Input label="P-Line Owner" value={release.pLine?.owner || "—"} readOnly />
        </fieldset>
      </DashboardSection>
    </motion.article>
  );
};

export default PreviewOverviewSection;
