import { renderEmailLayout } from './shared';

export const renderPasswordResetEmail = ({
  resetUrl,
  expiresInMinutes,
}: {
  resetUrl: string;
  expiresInMinutes: number;
}) =>
  renderEmailLayout({
    preview: 'Reset your Lens Music password.',
    eyebrow: 'Account security',
    title: 'Reset your password',
    body: [
      'We received a request to reset the password for your Lens Music account. Use the secure link below to choose a new password.',
      `This reset link expires in ${expiresInMinutes} minute${expiresInMinutes === 1 ? '' : 's'}. If you did not request a reset, you can ignore this email.`,
    ],
    ctaLabel: 'Reset password',
    ctaUrl: resetUrl,
    footer: 'For your security, only the most recent reset link remains active.',
  });
