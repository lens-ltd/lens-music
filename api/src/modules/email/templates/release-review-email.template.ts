import { renderEmailLayout } from './shared';

export type ReleaseReviewOutcome = 'APPROVED' | 'REJECTED';

export const renderReleaseReviewEmail = ({
  releaseTitle,
  outcome,
  reviewNotes,
  releaseUrl,
  logoUrl,
  appUrl,
}: {
  releaseTitle: string;
  outcome: ReleaseReviewOutcome;
  reviewNotes?: string;
  releaseUrl: string;
  logoUrl?: string;
  appUrl?: string;
}) => {
  const isApproved = outcome === 'APPROVED';

  const body = isApproved
    ? [
        `Good news — your release "${releaseTitle}" has been reviewed and approved for distribution.`,
        'You can view the release and continue with the next steps from your workspace.',
      ]
    : [
        `Your release "${releaseTitle}" was reviewed and has been sent back for changes.`,
        reviewNotes
          ? `Reviewer feedback: ${reviewNotes}`
          : 'Please review your release details and resubmit once updated.',
        'Open the release to make the requested changes and submit it again for review.',
      ];

  return renderEmailLayout({
    preview: isApproved
      ? `"${releaseTitle}" was approved.`
      : `"${releaseTitle}" needs changes.`,
    eyebrow: 'Release review',
    title: isApproved ? 'Release approved' : 'Changes requested',
    body,
    ctaLabel: 'Open release',
    ctaUrl: releaseUrl,
    footer: 'This is an automated update from the Lens Music review team.',
    logoUrl,
    appUrl,
  });
};
