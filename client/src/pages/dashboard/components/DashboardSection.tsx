import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import SectionCard, { SectionCardProps } from '@/components/layout/SectionCard';

interface DashboardSectionProps extends Omit<SectionCardProps, 'description'> {
  subtitle?: ReactNode;
  /** @deprecated Section labels are no longer shown. */
  label?: ReactNode;
  contentClassName?: string;
}

/** Dashboard-flavoured alias of SectionCard; prefer SectionCard in new code. */
const DashboardSection = ({
  subtitle,
  contentClassName,
  className,
  ...props
}: DashboardSectionProps) => (
  <SectionCard
    description={subtitle}
    className={cn(contentClassName, className)}
    {...props}
  />
);

export default DashboardSection;
