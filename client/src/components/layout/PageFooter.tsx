import { FC, MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';
import Button from '../inputs/Button';

const backClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded p-1 px-4 text-[13px] font-normal text-(--slate) transition-colors hover:bg-(--surface) hover:text-(--ink)';

/**
 * Breadcrumb-style back control. Rendered as a quiet inline control with
 * `p-1 px-4` spacing — never as a regular button. Pass `route` for a plain
 * navigation link, or `onClick` for a button action.
 */
export const BackButton: FC<{
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  route?: string;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}> = ({ children, onClick, route, disabled, className, ariaLabel }) => (
  <>
    {route && !disabled ? (
      <Link to={route} aria-label={ariaLabel} className={cn(backClass, className)}>
        <FontAwesomeIcon icon={faChevronLeft} className="text-[11px]" />
        {children}
      </Link>
    ) : (
      <Button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        className={cn(backClass, disabled && 'pointer-events-none opacity-45', className)}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="text-[11px]" />
        {children}
      </Button>
    )}
  </>
);

/**
 * Bottom action bar for detail and form pages: back control pinned to the
 * far left, primary actions pinned to the far right.
 */
export const PageFooter: FC<{
  back: ReactNode;
  actions?: ReactNode;
  className?: string;
}> = ({ back, actions, className }) => (
  <footer
    className={cn(
      'flex w-full items-center justify-between gap-3 border-t border-(--line) pt-4',
      className,
    )}
  >
    <div className="flex items-center gap-2">{back}</div>
    {actions ? (
      <div className="flex items-center justify-end gap-2">{actions}</div>
    ) : null}
  </footer>
);
