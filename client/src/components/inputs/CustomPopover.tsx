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
          <PopoverContent className={`mt-1 w-full min-w-44 p-1 ${className}`}>{children}</PopoverContent>
      </Popover>
  );
};

export default CustomPopover;
