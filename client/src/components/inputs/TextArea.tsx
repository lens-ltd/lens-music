import { FC, ChangeEvent, ReactNode, useEffect, useId, useRef } from 'react';
import { cn } from '@/lib/utils';
import { InputErrorMessage } from '../feedbacks/ErrorLabels';
import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
} from 'react-hook-form';

interface TextAreaProps {
  cols?: number;
  rows?: number;
  className?: string;
  defaultValue?: string | number | readonly string[] | undefined;
  resize?: boolean;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string | undefined;
  required?: boolean;
  readonly?: boolean;
  onBlur?: () => void | undefined;
  label?: string | ReactNode;
  value?: string | number | readonly string[] | undefined;
  errorMessage?:
    | string
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<FieldValues>>
    | undefined;
  name?: string;
}

const TextArea: FC<TextAreaProps> = ({
  cols = 50,
  rows = 5,
  className = '',
  defaultValue = undefined,
  resize = false,
  onChange,
  placeholder = undefined,
  required = false,
  readonly = false,
  onBlur,
  label = null,
  value,
  errorMessage,
  name,
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const generatedId = useId();
  const inputId = name || generatedId;
  const describedBy = errorMessage ? `${inputId}-error` : undefined;

  useEffect(() => {
    if (!defaultValue && !value && ref?.current) {
      ref.current.value = '';
    }
  }, [defaultValue, value]);

  return (
    <label className="field-stack">
      {label ? (
        <span className="field-label">
          {label}{' '}
          {required && (
            <span className="field-required" aria-hidden="true">
              *
            </span>
          )}
        </span>
      ) : null}
      <textarea
        id={inputId}
        cols={cols}
        rows={rows}
        ref={ref}
        name={name}
        value={value}
        readOnly={readonly}
        placeholder={placeholder}
        required={required}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          'field-chrome h-auto min-h-[7.5rem] py-2',
          !resize && 'resize-none',
          className,
        )}
        onChange={onChange}
        onBlur={onBlur}
        defaultValue={defaultValue}
      />
      {errorMessage && (
        <InputErrorMessage id={describedBy} message={errorMessage} />
      )}
    </label>
  );
};

export default TextArea;
