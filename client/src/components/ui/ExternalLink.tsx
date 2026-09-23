import { AnchorHTMLAttributes, ReactNode } from 'react';
import { LuArrowUpRight } from 'react-icons/lu';
import { cn } from '@/lib/utils';

interface ExternalLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'> {
  href: string;
  children: ReactNode;
  /** Hide the arrow when the link is an icon on its own, e.g. a social mark. */
  hideArrow?: boolean;
}

/** A link that opens in a new tab, always marked with the arrow-out icon. */
const ExternalLink = ({ href, children, className, hideArrow = false, ...props }: ExternalLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={cn('inline-flex items-center gap-1 text-(--signal) hover:underline underline-offset-4', className)}
    {...props}
  >
    {children}
    {!hideArrow && <LuArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />}
    <span className="sr-only">(opens in a new tab)</span>
  </a>
);

export default ExternalLink;
