import {
  Select as SelectComponent,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UUID } from 'crypto';
import { useId } from 'react';
import { cn } from '@/lib/utils';
import { InputErrorMessage } from '../feedbacks/ErrorLabels';
import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
} from 'react-hook-form';

const EMPTY_SELECT_VALUE = '__lens_empty_select_value__';

const toSelectValue = (value?: string | UUID) =>
  value === '' ? EMPTY_SELECT_VALUE : String(value ?? '');

const fromSelectValue = (value: string) =>
  value === EMPTY_SELECT_VALUE ? '' : value;

type SelectProps = {
  label?: string | number | undefined;
  options?: Array<{ label: string | undefined; value: string | UUID }>;
  defaultValue?: string | undefined;
  placeholder?: string;
  className?: string;
  onChange?: ((value: string) => void) | undefined;
  value?: string | undefined;
  required?: boolean;
  labelClassName?: string | undefined;
  name?: string | undefined;
  readOnly?: boolean;
  errorMessage?:
    | string
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<FieldValues>>
    | undefined;
};

const Select = ({
  options = [],
  defaultValue = undefined,
  placeholder = 'Select here...',
  className = undefined,
  value = '',
  onChange,
  label = undefined,
  required = false,
  labelClassName = undefined,
  name = undefined,
  readOnly = false,
  errorMessage,
}: SelectProps) => {
  const generatedId = useId();
  const describedBy = errorMessage ? `${generatedId}-error` : undefined;

  return (
    <label className={cn('field-stack', labelClassName)}>
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
      <SelectComponent
        onValueChange={(nextValue) => onChange?.(fromSelectValue(nextValue))}
        defaultValue={
          defaultValue === undefined ? undefined : toSelectValue(defaultValue)
        }
        value={value === undefined ? undefined : toSelectValue(value)}
        name={name}
        disabled={readOnly}
      >
        <SelectTrigger
          className={cn('field-chrome', className)}
          aria-required={required || undefined}
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={describedBy}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option, index: number) => {
              return (
                <SelectItem
                  key={index}
                  value={toSelectValue(option.value)}
                  disabled={readOnly}
                >
                  {option.label}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </SelectComponent>
      {errorMessage && (
        <InputErrorMessage id={describedBy} message={errorMessage} />
      )}
    </label>
  );
};

export default Select;
