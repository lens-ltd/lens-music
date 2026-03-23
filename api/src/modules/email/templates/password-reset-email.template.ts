import { renderEmailLayout } from './shared';

export const renderPasswordResetEmail = ({
  resetUrl,
  expiresInMinutes,
  logoUrl,
  appUrl,
}: {
  resetUrl: string;
  expiresInMinutes: number;
  logoUrl?: string;
  appUrl?: string;
}) =>
  renderEmailLayout({
    preview: 'Reset your Lens Music password.',
    eyebrow: 'Account security',
    title: 'Reset your password',
    body: [
      'Use the secure link below to choose a new password for your account.',
      `This link expires in ${expiresInMinutes} minute${expiresInMinutes === 1 ? '' : 's'}. If you did not request this, ignore this email.`,
    ],
    ctaLabel: 'Reset password',
    ctaUrl: resetUrl,
    footer: 'Only the most recent reset link remains active.',
    logoUrl,
    appUrl,
  });
