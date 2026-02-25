import {
  ChangeEvent,
  forwardRef,
  MouseEventHandler,
  ReactNode,
  useId,
  useRef,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Checkbox } from '../ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import DatePicker from './DatePicker';
import { Input as ShadcnInput } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface InputProps {
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  onChange?: ((e: ChangeEvent<HTMLInputElement>) => void) | undefined;
  defaultValue?: string | number | Date;
  submit?: boolean;
  type?: string;
  value?: string | number;
  suffixIcon?: IconProp;
  prefixIcon?: IconProp;
  suffixIconHandler?: MouseEventHandler<HTMLButtonElement> | undefined;
  name?: string;
  suffixIconPrimary?: boolean;
  prefixIconHandler?: MouseEventHandler<HTMLButtonElement> | undefined;
  prefixIconPrimary?: boolean;
  prefixText?: string | ReactNode;
  defaultChecked?: boolean | undefined;
  accept?: string;
  min?: string | number;
  readOnly?: boolean;
  multiple?: boolean;
  labelClassName?: string;
  range?: boolean;
  fromDate?: Date;
  toDate?: Date;
  checked?: boolean;
  selectionType?: 'date' | 'month' | 'year' | 'recurringDate';
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const fieldLabelClasses = 'text-[13px] leading-none text-[color:var(--lens-ink)] font-normal';
const helperRequiredClasses = 'text-[13px] leading-none text-red-600';
const baseInputClasses =
  'h-10 rounded-lg border-[1.5px] border-secondary/40 bg-white px-3 text-[13px] font-normal shadow-none placeholder:text-[12px] placeholder:font-normal placeholder:text-secondary/70 focus-visible:ring-0 focus-visible:border-primary';

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      label,
      placeholder,
      className,
      required = false,
      value = '',
      onChange,
      defaultValue,
      suffixIcon,
      suffixIconHandler,
      suffixIconPrimary = false,
      prefixIcon,
      prefixIconHandler,
      prefixText,
      defaultChecked,
      name,
      accept = 'application/pdf',
      min,
      readOnly = false,
      labelClassName = '',
      multiple = false,
      fromDate,
      toDate,
      checked,
      selectionType,
      onKeyPress,
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = name || generatedId;
    const hiddenFileInput = useRef<HTMLInputElement>(null);

    if (type === 'checkbox') {
      return (
        <label className={cn('inline-flex w-fit items-center gap-2 text-[12px] font-normal', labelClassName)}>
          <Checkbox
            className="border-secondary/50"
            onCheckedChange={onChange as unknown as ((checked: CheckedState) => void) | undefined}
            name={name}
            checked={checked}
            defaultChecked={defaultChecked}
          />
          {label && <span className="text-[12px] font-normal">{label}</span>}
        </label>
      );
    }

    if (type === 'radio') {
      return (
        <label className={cn('inline-flex items-center gap-2 text-[12px] font-normal', labelClassName)}>
          <input
            id={inputId}
            type="radio"
            name={name}
            value={value}
            defaultChecked={defaultChecked}
            checked={checked}
            onChange={onChange}
            className={cn(
              'h-4 w-4 cursor-pointer accent-primary border-secondary/50',
              className
            )}
          />
          {label && <span className="text-[12px] font-normal">{label}</span>}
        </label>
      );
    }

    if (type === 'file') {
      return (
        <div className={cn('w-fit', labelClassName)}>
          {label && (
            <p className={cn(fieldLabelClasses, 'mb-2')}>
              {label} {required && <span className={helperRequiredClasses}>*</span>}
            </p>
          )}
          <button
            type="button"
            onClick={() => hiddenFileInput.current?.click()}
            className={cn(
              'inline-flex h-9 items-center justify-center rounded-md border border-primary bg-white px-4 text-[12px] font-normal text-primary hover:bg-[color:var(--lens-sand)]',
              className
            )}
          >
            Choose file{multiple ? 's' : ''}
          </button>
          <input
            ref={hiddenFileInput}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={onChange}
            className="hidden"
            name={name}
          />
        </div>
      );
    }

    if (type === 'date') {
      return (
        <label className={cn('flex w-full flex-col gap-1.5', labelClassName)}>
          {label && (
            <span className={fieldLabelClasses}>
              {label} {required && <span className={helperRequiredClasses}>*</span>}
            </span>
          )}
          <DatePicker
            placeholder={placeholder}
            fromDate={fromDate}
            toDate={toDate}
            selectionType={selectionType}
            onChange={
              onChange as
                | ((e: Date | ChangeEvent<HTMLInputElement>) => void)
                | undefined
            }
            value={(value || defaultValue) as Date | undefined}
          />
        </label>
      );
    }

    const textInput = (
      <ShadcnInput
        id={inputId}
        defaultValue={defaultValue as string | number | readonly string[] | undefined}
        min={min}
        value={value}
        type={type || 'text'}
        readOnly={readOnly}
        name={name}
        ref={ref}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder={readOnly ? '' : placeholder}
        className={cn(
          baseInputClasses,
          readOnly && 'border-background bg-background/40 text-secondary cursor-default',
          prefixIcon && 'pl-10',
          prefixText && 'pl-14',
          suffixIcon && 'pr-11',
          className
        )}
      />
    );

    return (
      <label className={cn('flex w-full flex-col gap-1.5', labelClassName)}>
        {label && (
          <span className={cn(fieldLabelClasses, 'pl-0.5')}>
            {label} {required && <span className={helperRequiredClasses}>*</span>}
          </span>
        )}
        <div className="relative w-full">
          {(prefixIcon || prefixText) && (
            <button
              type="button"
              onClick={prefixIconHandler}
              className={cn(
                'absolute inset-y-0 left-0 flex items-center px-3 text-secondary',
                !prefixIconHandler && 'pointer-events-none'
              )}
              aria-label={typeof prefixText === 'string' ? prefixText : label || 'Prefix action'}
            >
              {prefixIcon && <FontAwesomeIcon icon={prefixIcon} />}
              {prefixText && <span className="text-[13px] font-normal">{prefixText}</span>}
            </button>
          )}

          {textInput}

          {suffixIcon && (
            <button
              type="button"
              onClick={suffixIconHandler}
              className={cn(
                'absolute inset-y-0 right-0 flex h-full items-center justify-center rounded-r-lg border-l px-3 text-[12px]',
                suffixIconPrimary
                  ? 'border-primary bg-primary text-white'
                  : 'border-secondary/30 bg-white text-primary'
              )}
              aria-label={`${label || 'Input'} action`}
            >
              <FontAwesomeIcon icon={suffixIcon || faSearch} />
            </button>
          )}
        </div>
      </label>
    );
  }
);

Input.displayName = 'Input';

export default Input;
