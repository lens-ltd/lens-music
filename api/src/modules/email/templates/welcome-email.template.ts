import { renderEmailLayout } from './shared';

export const renderWelcomeEmail = ({
  name,
  dashboardUrl,
  logoUrl,
  appUrl,
}: {
  name: string;
  dashboardUrl: string;
  logoUrl?: string;
  appUrl?: string;
}) =>
  renderEmailLayout({
    preview: 'Your Lens Music account is ready.',
    eyebrow: 'Welcome',
    title: `Welcome to Lens Music, ${name}`,
    body: [
      'Your account is set up and ready to use.',
      'You can start distributing releases, managing contributors, and tracking your catalog performance from your dashboard.',
    ],
    ctaLabel: 'Go to dashboard',
    ctaUrl: dashboardUrl,
    footer: 'If you did not create this account, please contact support.',
    logoUrl,
    appUrl,
  });
