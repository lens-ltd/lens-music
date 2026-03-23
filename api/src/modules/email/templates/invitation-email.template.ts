import { renderEmailLayout } from './shared';

export const renderInvitationEmail = ({
  invitationUrl,
  expiresInDays,
  logoUrl,
  appUrl,
}: {
  invitationUrl: string;
  expiresInDays: number;
  logoUrl?: string;
  appUrl?: string;
}) =>
  renderEmailLayout({
    preview: 'You are invited to Lens Music.',
    eyebrow: 'Invitation only',
    title: 'Join Lens Music',
    body: [
      'You have access to Lens Music. Open the link below to create your password and finish setup.',
      `Link expires in ${expiresInDays} day${expiresInDays === 1 ? '' : 's'}. Only the most recent invitation link stays valid.`,
    ],
    ctaLabel: 'Complete registration',
    ctaUrl: invitationUrl,
    footer: 'If you did not expect this, you can ignore this email.',
    logoUrl,
    appUrl,
  });
