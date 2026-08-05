import { ContributorRole } from "@/types/models/releaseContributor.types";

export const DISPLAY_ARTIST_ROLES = new Set<ContributorRole>([
  ContributorRole.PRIMARY_ARTIST,
  ContributorRole.FEATURED_ARTIST,
]);

type ContributorIdentity = {
  displayName?: string;
  name?: string;
  email?: string;
};

export const getContributorCreditName = (
  contributor: ContributorIdentity | undefined,
  role: ContributorRole,
): string => {
  if (!contributor) return "Unknown contributor";

  const displayName = contributor.displayName?.trim();
  const fullName = contributor.name?.trim();
  const email = contributor.email?.trim();

  return DISPLAY_ARTIST_ROLES.has(role)
    ? displayName || fullName || email || "Unknown contributor"
    : fullName || displayName || email || "Unknown contributor";
};

export const getContributorSearchName = (
  contributor: ContributorIdentity,
): string =>
  contributor.displayName?.trim() ||
  contributor.name?.trim() ||
  contributor.email?.trim() ||
  "Unnamed contributor";
