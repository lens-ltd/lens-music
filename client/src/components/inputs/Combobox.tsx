import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { forwardRef, useId, useState } from 'react';
import { SkeletonLoader } from './Loader';
import { FieldError, FieldErrorsImpl, FieldValues, Merge } from 'react-hook-form';
import { InputErrorMessage } from '../feedbacks/ErrorLabels';

type Option = {
    label: string;
    value: string;
    disabled?: boolean;
};

interface ComboboxProps {
    options?: Option[];
    placeholder?: string;
    onChange?: (value: string) => void;
    label?: string;
    required?: boolean;
    labelClassName?: string;
    className?: string;
    inputClassName?: string;
    optionsClassName?: string;
    selectedValueClassName?: string;
    value?: string;
    defaultValue?: string;
    isLoading?: boolean;
    readOnly?: boolean;
    errorMessage?: string | FieldError | Merge<FieldError, FieldErrorsImpl<FieldValues>> | undefined;
}

const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
    (
        {
            options = [],
            placeholder,
            onChange,
            label,
            required,
            labelClassName,
            className,
            inputClassName,
            optionsClassName,
            selectedValueClassName,
            value,
            defaultValue,
            isLoading,
            readOnly,
            errorMessage,
        },
        ref
    ) => {
        const [open, setOpen] = useState(false);
        const generatedId = useId();
        const describedBy = errorMessage ? `${generatedId}-error` : undefined;
        const selectedLabel = options.find((option) => option.value === value)?.label;

        return (
            <div className={cn('field-stack', labelClassName)}>
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
                <Popover
                    open={open}
                    onOpenChange={readOnly ? undefined : setOpen}
                    modal
                >
                    <PopoverTrigger asChild className={cn('w-full', className)}>
                        {isLoading ? (
                            <SkeletonLoader type="input" />
                        ) : (
                            <button
                                type="button"
                                role="combobox"
                                aria-expanded={open}
                                aria-required={required || undefined}
                                aria-invalid={errorMessage ? true : undefined}
                                aria-describedby={describedBy}
                                disabled={readOnly}
                                className={cn(
                                    'field-chrome flex items-center justify-between font-normal',
                                    inputClassName,
                                    className,
                                )}
                            >
                                <span
                                    className={cn(
                                        'flex-1 block w-full text-left truncate max-w-[calc(100%-24px)] type-body-sm',
                                        value
                                            ? selectedValueClassName
                                            : 'text-(--muted)',
                                    )}
                                >
                                    {value ? selectedLabel : (placeholder || 'Select option...')}
                                </span>
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 text-(--muted) flex-none" />
                            </button>
                        )}
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-(--radix-popover-trigger-width) min-w-(--radix-popover-trigger-width) p-0 card-framed shadow-[var(--shadow-menu)]"
                        align="start"
                    >
                        <Command ref={ref} className="w-full">
                            <CommandInput
                                placeholder="Search option..."
                                className={cn('type-body-sm', inputClassName)}
                            />
                            <CommandList className="w-full">
                                <CommandEmpty
                                    className={cn(
                                        'w-full text-center type-body-sm text-(--muted) py-3',
                                        optionsClassName,
                                    )}
                                >
                                    No option found.
                                </CommandEmpty>
                                <CommandGroup className="w-full">
                                    {(options ?? [])?.map((option) => (
                                        <CommandItem
                                            key={option.value || option.label}
                                            defaultValue={defaultValue}
                                            disabled={option?.disabled}
                                            className="flex items-center gap-2 w-full cursor-pointer overflow-hidden type-body-sm"
                                            value={option.label}
                                            onSelect={(currentValue) => {
                                                const selectedOption = options.find(
                                                    (item) => item.label === currentValue
                                                );
                                                onChange?.(selectedOption?.value || '');
                                                setOpen(false);
                                            }}
                                        >
                                            <p
                                                className={cn(
                                                    'truncate max-w-[calc(100%-24px)] type-body-sm',
                                                    option?.disabled && 'text-(--disabled-fg) cursor-not-allowed',
                                                    optionsClassName,
                                                )}
                                            >
                                                {option.label}
                                            </p>
                                            <CheckIcon
                                                className={cn(
                                                    'ml-auto h-4 w-4 flex-none text-(--lens-blue)',
                                                    value === option.value ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {errorMessage && (
                    <InputErrorMessage id={describedBy} message={errorMessage} />
                )}
            </div>
        );
    }
);

Combobox.displayName = 'Combobox';

export default Combobox;
