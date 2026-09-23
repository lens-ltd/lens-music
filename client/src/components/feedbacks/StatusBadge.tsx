import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  capitalizeString,
  getStatusTone,
  getStatusToneClassName,
  StatusTone,
} from '@/utils/strings.helper';

interface StatusBadgeProps {
  /** Backend status, e.g. `APPROVED`. Picks the tone and the default label. */
  status?: string;
  /** Overrides the tone derived from `status`. */
  tone?: StatusTone;
  children?: ReactNode;
  className?: string;
}

const StatusBadge = ({ status, tone, children, className }: StatusBadgeProps) => (
  <span className={cn(getStatusToneClassName(tone ?? getStatusTone(status)), className)}>
    {children ?? capitalizeString(status)}
  </span>
);

export default StatusBadge;
