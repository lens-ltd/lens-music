import { Button } from '@/components/ui/button';
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
import { forwardRef, useState } from 'react';
import { SkeletonLoader } from './Loader';
import CustomTooltip from './CustomTooltip';
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

        return (
            <label className={`flex flex-col gap-1 w-full ${labelClassName}`}>
                <p
                    className={
                        label ? 'flex items-center gap-1 text-sm font-normal text-black' : 'hidden'
                    }
                >
                    {label}{' '}
                    {required && (
                        <CustomTooltip
                            label={required ? `${label} is required` : ''}
                            labelClassName="text-[12px] bg-red-700"
                        >
                            <span className="text-red-700 cursor-pointer">*</span>
                        </CustomTooltip>
                    )}
                </p>
                <Popover
                    open={open}
                    onOpenChange={readOnly ? undefined : setOpen}
                    modal
                >
                    <PopoverTrigger asChild className={`w-full ${className}`}>
                        {isLoading ? (
                            <SkeletonLoader />
                        ) : (
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className={`w-full flex hover:bg-gray-100 items-center justify-between font-normal ${inputClassName || 'text-[12px]'
                                    } ${className || 'h-10 hover:bg-gray-100'}`}
                            >
                                <span
                                    className={`flex-1 block w-full text-left truncate max-w-[calc(100%-24px)] ${value ?
                                            (selectedValueClassName || inputClassName || 'text-[12px]') :
                                            `text-gray-500 ${inputClassName || 'text-[12px]'}`
                                        }`}
                                >
                                    {value ?
                                        options.find((option) => option.value === value)?.label :
                                        (placeholder || 'Select option...')
                                    }
                                </span>
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50 text-[12px] flex-none" />
                            </Button>
                        )}
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command ref={ref} className="w-full">
                            <CommandInput
                                placeholder="Search option..."
                                className={`h-9 w-full ${inputClassName || 'text-[12px]'}`}
                            />
                            <CommandList ref={ref} className="w-full">
                                <CommandEmpty
                                    className={`w-full text-center text-primary ${optionsClassName || 'text-[12px] py-2'
                                        }`}
                                >
                                    No option found.
                                </CommandEmpty>
                                <CommandGroup className="w-full">
                                    {(options ?? [])?.map((option) => (
                                        <CommandItem
                                            key={option.label}
                                            defaultValue={defaultValue}
                                            disabled={option?.disabled}
                                            className="flex items-center gap-2 w-full cursor-pointer overflow-hidden hover:bg-gray-100"
                                            value={option.label}
                                            onSelect={(currentValue) => {
                                                const selectedOption = options.find(
                                                    (option) => option.label === currentValue
                                                );
                                                onChange?.(selectedOption?.value || '');
                                                setOpen(false);
                                            }}
                                        >
                                            <p
                                                className={`${option?.disabled && `text-gray-400 cursor-not-allowed`
                                                    } truncate max-w-[calc(100%-24px)] ${optionsClassName || 'text-[12px]'
                                                    }`}
                                            >
                                                {option.label}
                                            </p>
                                            <CheckIcon
                                                className={cn(
                                                    'ml-auto h-4 w-4 flex-none',
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
                    <InputErrorMessage message={errorMessage} className="mt-1.5" />
                )}
            </label>
        );
    }
);

Combobox.displayName = 'Combobox';

export default Combobox;
