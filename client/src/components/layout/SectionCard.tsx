import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface SectionCardProps {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  overflowHidden?: boolean;
  /** `panel` frames the section as a white card; `open` lays its content on the canvas. */
  variant?: 'panel' | 'open';
}

/**
 * The white content card every page section sits in, on the gray canvas.
 * Nested tiles inside it use `--surface`.
 */
const SectionCard = ({
  title,
  description,
  action,
  children,
  className,
  headerClassName,
  bodyClassName,
  overflowHidden = false,
  variant = 'panel',
}: SectionCardProps) => {
  const hasHeader = Boolean(title || description || action);

  return (
    <section
      className={cn(
        'flex flex-col',
        variant === 'panel' && 'card-framed p-5 sm:p-6',
        overflowHidden && 'overflow-hidden',
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
            {title && <h2 className="type-card-title text-(--ink)">{title}</h2>}
            {description && <p className="mt-0.5 type-meta">{description}</p>}
          </div>
          {action && <div className="w-full md:w-auto md:max-w-full">{action}</div>}
        </header>
      )}

      <div className={cn(hasHeader && 'pt-4', bodyClassName)}>{children}</div>
    </section>
  );
};

export default SectionCard;
