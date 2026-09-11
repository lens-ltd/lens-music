import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
} from 'react-hook-form';
import { cn } from '@/lib/utils';

export const InputErrorMessage = ({
  message,
  className,
  id,
}: {
  message:
    | string
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<FieldValues>>
    | undefined;
  className?: string;
  id?: string;
}) => {
  return (
    <p id={id} className={cn('type-meta text-(--danger)', className)} role="alert">
      {String(message)}
    </p>
  );
};
