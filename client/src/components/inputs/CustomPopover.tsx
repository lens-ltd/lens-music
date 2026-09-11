import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ReactNode } from 'react';

type CustomPopoverProps = {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
};

const CustomPopover = ({
  trigger,
  children,
  className,
}: CustomPopoverProps) => {
  return (
      <Popover>
          <PopoverTrigger asChild>{trigger}</PopoverTrigger>
          <PopoverContent className={`rounded-(--radius-control) border border-(--menu-border) bg-(--paper) mt-2 w-full p-2 shadow-[var(--shadow-menu)] ${className}`}>{children}</PopoverContent>
      </Popover>
  );
};

export default CustomPopover;
