import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { forwardRef, useId, useMemo, useState } from 'react';
import { SkeletonLoader } from './Loader';
import { FieldError, FieldErrorsImpl, FieldValues, Merge } from 'react-hook-form';
import { InputErrorMessage } from '../feedbacks/ErrorLabels';

import { LuCheck, LuChevronsUpDown, LuSearch } from 'react-icons/lu';

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
        // Controlled search with manual filtering so results never depend on
        // implicit cmdk store behavior.
        const [search, setSearch] = useState('');
        const generatedId = useId();
        const describedBy = errorMessage ? `${generatedId}-error` : undefined;
        const selectedLabel = options.find((option) => option.value === value)?.label;

        const visibleOptions = useMemo(() => {
            const query = search.trim().toLowerCase();
            if (!query) return options;
            return options.filter((option) =>
                option.label.toLowerCase().includes(query)
            );
        }, [options, search]);

        const handleOpenChange = (nextOpen: boolean) => {
            setOpen(nextOpen);
            // Reset the query whenever the menu closes so the next open
            // starts from the full list.
            if (!nextOpen) setSearch('');
        };

        const selectOption = (selectedValue: string) => {
            onChange?.(selectedValue);
            setOpen(false);
            setSearch('');
        };

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
                    onOpenChange={readOnly ? undefined : handleOpenChange}
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
                                    'field-chrome flex items-center justify-between gap-2 text-left',
                                    inputClassName,
                                    className,
                                )}
                            >
                                <span
                                    className={cn(
                                        'block min-w-0 flex-1 truncate',
                                        value
                                            ? selectedValueClassName
                                            : 'text-(--placeholder)',
                                    )}
                                >
                                    {value ? selectedLabel : (placeholder || 'Select option...')}
                                </span>
                                <LuChevronsUpDown className="size-4 shrink-0 text-(--muted)" aria-hidden="true" />
                            </button>
                        )}
                    </PopoverTrigger>
                    <PopoverContent
                        data-combobox-menu=""
                        className="w-(--radix-popover-trigger-width) min-w-(--radix-popover-trigger-width) p-0"
                        align="start"
                        onOpenAutoFocus={(event) => {
                            // Let the popover FocusScope autofocus proceed
                            // deterministically to the search field below.
                            if (event.defaultPrevented) return;
                        }}
                        onCloseAutoFocus={(event) => {
                            event.preventDefault();
                        }}
                    >
                        <Command ref={ref} className="w-full" shouldFilter={false}>
                            {/* Plain controlled input: search state never
                                depends on cmdk store behavior, so typing and
                                filtering work identically on pages and in
                                modals. cmdk still owns list rendering,
                                arrow/enter selection, and the empty state. */}
                            <div className="flex items-center gap-2 border-b border-(--line) px-3" cmdk-input-wrapper="">
                                <LuSearch className="size-4 shrink-0 text-(--muted)" aria-hidden="true" />
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search options"
                                    aria-label="Search options"
                                    className={cn(
                                        'flex h-(--control-md) w-full bg-transparent text-sm outline-none placeholder:text-(--placeholder) disabled:cursor-not-allowed disabled:opacity-50',
                                        inputClassName,
                                    )}
                                />
                            </div>
                            <CommandList className="w-full">
                                <CommandEmpty
                                    className={cn(
                                        'w-full py-4 text-center text-sm text-(--muted)',
                                        optionsClassName,
                                    )}
                                >
                                    No matches. Try a different search.
                                </CommandEmpty>
                                <CommandGroup className="w-full">
                                    {visibleOptions.map((option) => (
                                        <CommandItem
                                            key={option.value || option.label}
                                            defaultValue={defaultValue}
                                            disabled={option?.disabled}
                                            className="overflow-hidden"
                                            value={option.label}
                                            keywords={[option.value]}
                                            onSelect={() => selectOption(option.value)}
                                        >
                                            <p
                                                className={cn(
                                                    'min-w-0 flex-1 truncate',
                                                    option?.disabled && 'text-(--placeholder) cursor-not-allowed',
                                                    optionsClassName,
                                                )}
                                            >
                                                {option.label}
                                            </p>
                                            <LuCheck
                                                className={cn(
                                                    'size-4 flex-none text-(--signal)',
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
