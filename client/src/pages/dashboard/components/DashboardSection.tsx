import { ReactNode } from 'react';
import { RelaxedHeading } from '@/components/text/Headings';
import { cn } from '@/lib/utils';

interface DashboardSectionProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  label?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  overflowHidden?: boolean;
  variant?: 'panel' | 'open';
}

const DashboardSection = ({
  title,
  subtitle,
  label,
  action,
  children,
  className,
  contentClassName,
  headerClassName,
  bodyClassName,
  overflowHidden = false,
  variant = 'panel',
}: DashboardSectionProps) => {
  const hasHeader = Boolean(title || subtitle || label || action);

  return (
    <section
      className={cn(
        variant === 'panel'
          ? 'flex flex-col card-framed'
          : 'flex flex-col border-t border-(--line) pt-1',
        overflowHidden && 'overflow-hidden',
        contentClassName,
        className
      )}
    >
      {hasHeader && (
        <header
          className={cn(
            'flex flex-col items-start gap-3 px-4 pt-4 sm:px-5 sm:pt-5 md:flex-row md:justify-between',
            headerClassName
          )}
        >
          <div className="min-w-0">
            {label && <RelaxedHeading>{label}</RelaxedHeading>}
            {title && (
              <h2
                className={cn(
                  'type-card-title text-(--ink)',
                  label && 'mt-1.5'
                )}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-0.5 type-meta">
                {subtitle}
              </p>
            )}
          </div>
          {action && (
            <div className="w-full md:w-auto md:max-w-full">
              {action}
            </div>
          )}
        </header>
      )}

      <div
        className={cn(
          hasHeader ? 'px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4' : 'p-4 sm:p-5',
          bodyClassName
        )}
      >
        {children}
      </div>
    </section>
  );
};

export default DashboardSection;
