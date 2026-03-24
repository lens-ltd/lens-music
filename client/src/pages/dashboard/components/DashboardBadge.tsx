import { ReactNode } from 'react';

export type DashboardBadgeTone = 'primary' | 'accent' | 'muted' | 'outline';

const dashboardBadgeClasses: Record<DashboardBadgeTone, string> = {
  primary:
    'border border-[color:var(--lens-blue)]/20 bg-[color:var(--lens-blue)]/10 text-[color:var(--lens-blue)]',
  accent:
    'border border-[color:var(--lens-sand)] bg-[color:var(--lens-sand)] text-[color:var(--lens-ink)]/65',
  muted:
    'border border-[color:var(--lens-ink)]/10 bg-[color:var(--lens-ink)]/5 text-[color:var(--lens-ink)]/50',
  outline:
    'border border-[color:var(--lens-sand)] text-[color:var(--lens-ink)]/55',
};

export const DashboardBadge = ({
  children,
  tone,
}: {
  children: ReactNode;
  tone: DashboardBadgeTone;
}) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-normal ${dashboardBadgeClasses[tone]}`}
  >
    {children}
  </span>
);
