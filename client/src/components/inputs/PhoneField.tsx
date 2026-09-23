import { forwardRef, useId } from 'react';
import type { FieldError } from 'react-hook-form';
import type { Country } from 'react-phone-number-input';
import { cn } from '@/lib/utils';
import { InputErrorMessage } from '../feedbacks/ErrorLabels';
import PhoneInput from './PhoneInput';

interface PhoneFieldProps {
  label?: string;
  name?: string;
  /** E.164 value, for example `+250788123456`. */
  value?: string | null;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  defaultCountry?: Country;
  errorMessage?: string | FieldError;
  className?: string;
}

/**
 * A phone number with a country calling-code picker. It works as a controlled
 * field, so it fits both a react-hook-form `Controller` (pair it with
 * `phoneRules` from `utils/phone.helper`) and plain component state. It lives
 * in its own module so the phone metadata only loads where a number is recorded.
 */
const PhoneField = forwardRef<HTMLDivElement, PhoneFieldProps>(
  (
    {
      label,
      name,
      value,
      onChange,
      onBlur,
      required,
      readOnly,
      disabled,
      placeholder,
      defaultCountry = 'RW',
      errorMessage,
      className,
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = name || generatedId;
    const message =
      typeof errorMessage === 'string' ? errorMessage : errorMessage?.message;
    const describedBy = message ? `${inputId}-error` : undefined;

    return (
      <div ref={ref} className={cn('field-stack', className)}>
        {label ? (
          // Linked by `htmlFor` rather than wrapping, so clicking the label
          // focuses the number instead of opening the country picker.
          <label htmlFor={inputId} className="field-label">
            {label}{' '}
            {required && (
              <span className="field-required" aria-hidden="true">
                *
              </span>
            )}
          </label>
        ) : null}
        <PhoneInput
          id={inputId}
          name={name}
          value={value ?? ''}
          onValueChange={(next) => onChange?.(next)}
          onBlur={onBlur}
          invalid={Boolean(message)}
          required={required}
          readOnly={readOnly}
          disabled={disabled}
          describedBy={describedBy}
          defaultCountry={defaultCountry}
          placeholder={placeholder}
        />
        {message ? (
          <InputErrorMessage id={describedBy} message={message} className="mt-0.5" />
        ) : null}
      </div>
    );
  },
);

PhoneField.displayName = 'PhoneField';

export default PhoneField;
