import {
  Select as SelectComponent,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UUID } from 'crypto';

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
}: SelectProps) => {
  return (
    <label className={`flex flex-col gap-1 w-full ${labelClassName}`}>
      <p className={label ? 'flex items-center gap-1 text-[12px]' : 'hidden'}>
        {label} <span className={required ? `text-red-600` : 'hidden'}>*</span>
      </p>
      <SelectComponent
        onValueChange={(nextValue) => onChange?.(fromSelectValue(nextValue))}
        defaultValue={
          defaultValue === undefined ? undefined : toSelectValue(defaultValue)
        }
        value={value === undefined ? undefined : toSelectValue(value)}
        name={name}
      >
        <SelectTrigger
          className={`w-full cursor-pointer focus:ring-transparent ring-0 h-10 ${className}`}
        >
          <SelectValue
            className="text-[10px]!"
            placeholder={
              <p className="text-[12px] text-[color:var(--lens-ink)]/55">{placeholder}</p>
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option, index: number) => {
              return (
                <SelectItem
                  key={index}
                  value={toSelectValue(option.value)}
                  disabled={readOnly}
                  className="cursor-pointer text-[12px] py-1 hover:bg-background"
                >
                  <p className="text-[12px] py-[3px]">{option.label}</p>
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </SelectComponent>
    </label>
  );
};

export default Select;
