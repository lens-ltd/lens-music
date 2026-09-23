import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import PhoneInputWithCountry, {
  getCountryCallingCode,
  type Country,
} from 'react-phone-number-input';
import countryLabels from 'react-phone-number-input/locale/en.json';
import { cn } from '@/lib/utils';
import Combobox from './Combobox';

interface CountrySelectProps {
  value?: Country;
  onChange: (country?: Country) => void;
  options: Array<{ value?: Country; label: string; divider?: boolean }>;
  disabled?: boolean;
  readOnly?: boolean;
}

/**
 * The country selector the phone control mounts. It is the same combobox used
 * elsewhere in the app, narrowed to the calling code so the number itself keeps
 * the room it needs. Search matches the country name and its calling code.
 */
const CountryCallingCodeSelect = ({
  value,
  onChange,
  options,
  disabled,
  readOnly,
}: CountrySelectProps) => {
  const countries = options.flatMap((option) =>
    option.value && !option.divider
      ? [
          {
            value: option.value,
            label: option.label,
            hint: `+${getCountryCallingCode(option.value)}`,
          },
        ]
      : [],
  );

  // `field-stack` and `field-chrome` both fill their container, so the width
  // comes from this wrapper rather than from classes on the combobox itself.
  return (
    <div className="w-36 shrink-0">
      <Combobox
        value={value ?? ''}
        onChange={(next) => onChange((next as Country) || undefined)}
        options={countries}
        disabled={disabled}
        readOnly={readOnly}
        ariaLabel="Country calling code"
        placeholder="Country"
        searchPlaceholder="Search countries"
        emptyText="No matching country"
        triggerLabel={value ? `${value} +${getCountryCallingCode(value)}` : undefined}
        contentClassName="w-72 max-w-[calc(100vw-3rem)]"
      />
    </div>
  );
};

const PhoneNumberInput = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<'input'>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      className={cn('field-chrome min-w-0 flex-1', className)}
      {...props}
    />
  ),
);

PhoneNumberInput.displayName = 'PhoneNumberInput';

export interface PhoneInputProps {
  /** E.164 value, for example `+250788123456`; empty when there is no number. */
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  id?: string;
  name?: string;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  describedBy?: string;
  defaultCountry?: Country;
  placeholder?: string;
  className?: string;
}

const PhoneInput = ({
  value,
  onValueChange,
  onBlur,
  id,
  name,
  invalid,
  disabled,
  readOnly,
  required,
  describedBy,
  defaultCountry = 'RW',
  placeholder = 'Phone number',
  className,
}: PhoneInputProps) => (
  <PhoneInputWithCountry
    id={id}
    name={name}
    defaultCountry={defaultCountry}
    // A stored number is shown the same way a typed one is: the calling code
    // stays in the selector rather than being repeated in the input.
    initialValueFormat="national"
    labels={countryLabels}
    value={value || undefined}
    onChange={(next?: string) => onValueChange(next ?? '')}
    onBlur={onBlur}
    disabled={disabled}
    readOnly={readOnly}
    placeholder={placeholder}
    aria-invalid={invalid || undefined}
    aria-required={required || undefined}
    aria-describedby={describedBy}
    countrySelectComponent={CountryCallingCodeSelect}
    inputComponent={PhoneNumberInput}
    className={cn('flex items-center gap-2', className)}
  />
);

export default PhoneInput;
