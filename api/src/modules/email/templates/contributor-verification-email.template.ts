import { renderEmailLayout } from './shared';

export type ContributorVerificationOutcome = 'VERIFIED' | 'REJECTED';

export const renderContributorVerificationEmail = ({
  contributorName,
  outcome,
  notes,
  contributorUrl,
  logoUrl,
  appUrl,
}: {
  contributorName: string;
  outcome: ContributorVerificationOutcome;
  notes?: string;
  contributorUrl: string;
  logoUrl?: string;
  appUrl?: string;
}) => {
  const isVerified = outcome === 'VERIFIED';

  const body = isVerified
    ? [
        `The contributor profile "${contributorName}" has been verified.`,
        'Verified contributors are eligible to appear on releases delivered to stores.',
      ]
    : [
        `The contributor profile "${contributorName}" could not be verified at this time.`,
        notes
          ? `Reviewer note: ${notes}`
          : 'Please review the contributor details and request verification again once updated.',
      ];

  return renderEmailLayout({
    preview: isVerified
      ? `"${contributorName}" was verified.`
      : `"${contributorName}" was not verified.`,
    eyebrow: 'Contributor verification',
    title: isVerified ? 'Contributor verified' : 'Verification not approved',
    body,
    ctaLabel: 'View contributor',
    ctaUrl: contributorUrl,
    footer: 'This is an automated update from the Lens Music review team.',
    logoUrl,
    appUrl,
  });
};
