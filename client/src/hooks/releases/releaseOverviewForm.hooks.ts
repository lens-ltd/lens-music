import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import moment from "moment";
import {
  Release,
  ReleaseParentalAdvisory,
  ReleaseType,
} from "@/types/models/release.types";
import { ReleaseGenreType } from "@/types/models/releaseGenre.types";

export interface ReleaseOverviewFormValues {
  type: ReleaseType;
  title: string;
  titleVersion?: string;
  version?: string;
  productionYear: string;
  originalReleaseDate: string | Date;
  digitalReleaseDate: string | Date;
  preorderDate?: string | Date;
  cLine: {
    year: string;
    owner: string;
  };
  pLine: {
    year: string;
    owner: string;
  };
  parentalAdvisory: ReleaseParentalAdvisory;
  primaryLanguage: string;
  primaryGenreId: string;
  secondaryGenreId?: string;
  metadataLanguage?: string;
  grid?: string;
  description?: string;
  keywords?: string;
  marketingComment?: string;
}

// RELEASE OVERVIEW FORM VALUES
// Sensible defaults so the wizard is effortless, only applied where the
// release field is unset, never overwriting real data.
export const getReleaseOverviewFormValues = (
  release?: Release,
): ReleaseOverviewFormValues => {
  const currentYear = String(moment().year());

  return {
    type: release?.type || ReleaseType.ALBUM,
    title: release?.title || "",
    titleVersion: release?.titleVersion || "",
    version: release?.version || "",
    productionYear: release?.productionYear
      ? String(release.productionYear)
      : currentYear,
    originalReleaseDate:
      release?.originalReleaseDate || moment().format("YYYY-MM-DD"),
    digitalReleaseDate:
      release?.digitalReleaseDate ||
      moment().add(14, "days").format("YYYY-MM-DD"),
    preorderDate: release?.preorderDate || "",
    cLine: {
      year: release?.cLine?.year ? String(release.cLine.year) : currentYear,
      owner: release?.cLine?.owner || "",
    },
    pLine: {
      year: release?.pLine?.year ? String(release.pLine.year) : currentYear,
      owner: release?.pLine?.owner || "",
    },
    parentalAdvisory:
      release?.parentalAdvisory || ReleaseParentalAdvisory.NOT_EXPLICIT,
    primaryLanguage: release?.primaryLanguage || "en",
    primaryGenreId:
      release?.genres?.find((item) => item.type === ReleaseGenreType.PRIMARY)
        ?.genreId || "",
    secondaryGenreId:
      release?.genres?.find((item) => item.type === ReleaseGenreType.SECONDARY)
        ?.genreId || "",
    metadataLanguage: release?.metadataLanguage || "en",
    grid: release?.grid || "",
    description: release?.description || "",
    keywords: release?.keywords?.length ? release.keywords.join(", ") : "",
    marketingComment: release?.marketingComment || "",
  };
};

// RELEASE OVERVIEW FORM
// The form loads the release once per id. Later updates to the same release
// (a cover-art upload, a background refetch) leave typed values alone; the
// step calls `reset` itself after a successful save.
export const useReleaseOverviewForm = (release?: Release) => {
  const form = useForm<ReleaseOverviewFormValues>({
    defaultValues: getReleaseOverviewFormValues(release),
  });
  const { reset } = form;
  const loadedReleaseId = useRef(release?.id);

  useEffect(() => {
    if (!release?.id || loadedReleaseId.current === release.id) return;
    loadedReleaseId.current = release.id;
    reset(getReleaseOverviewFormValues(release));
  }, [release, reset]);

  return form;
};
