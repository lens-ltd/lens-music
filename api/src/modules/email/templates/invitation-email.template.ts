import { renderEmailLayout } from './shared';

export const renderInvitationEmail = ({
  invitationUrl,
  expiresInDays,
}: {
  invitationUrl: string;
  expiresInDays: number;
}) =>
  renderEmailLayout({
    preview: 'You have been invited to join Lens Music.',
    eyebrow: 'Invitation only',
    title: 'Complete your Lens Music registration',
    body: [
      'You have been invited to access Lens Music. Use the secure link below to finish setting up your account and create your password.',
      `This invitation expires in ${expiresInDays} day${expiresInDays === 1 ? '' : 's'}. If you receive a newer invitation, only the latest link will work.`,
    ],
    ctaLabel: 'Complete registration',
    ctaUrl: invitationUrl,
    footer: 'If you were not expecting this invitation, you can safely ignore this email.',
  });
