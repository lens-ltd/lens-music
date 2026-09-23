import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardSectionProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  /** @deprecated Section labels are no longer shown. */
  label?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  overflowHidden?: boolean;
  /** @deprecated Sections no longer differ visually. */
  variant?: 'panel' | 'open';
}

const DashboardSection = ({
  title,
  subtitle,
  action,
  children,
  className,
  contentClassName,
  headerClassName,
  bodyClassName,
  overflowHidden = false,
}: DashboardSectionProps) => {
  const hasHeader = Boolean(title || subtitle || action);

  return (
    <section
      className={cn(
        'flex flex-col',
        overflowHidden && 'overflow-hidden',
        contentClassName,
        className
      )}
    >
      {hasHeader && (
        <header
          className={cn(
            'flex flex-col items-start gap-3 md:flex-row md:justify-between',
            headerClassName
          )}
        >
          <div className="min-w-0">
            {title && (
              <h2
                className="type-card-title text-(--ink)"
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
          hasHeader ? 'pt-4' : '',
          bodyClassName
        )}
      >
        {children}
      </div>
    </section>
  );
};

export default DashboardSection;
