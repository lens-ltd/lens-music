import { getCountryName } from '@/constants/countries.constants';
import { capitalizeString, formatDate } from '@/utils/strings.helper';
import { SkeletonLoader } from './Loader';
import { ReactNode, isValidElement } from 'react';
import type { IconType } from 'react-icons';
import { cn } from '@/lib/utils';

import { LuCircleCheck, LuX } from 'react-icons/lu';
import { Icon } from '@/components/ui/icon';

/** Keys that never render: internal ids and bookkeeping fields. */
const hiddenKeys = [
    'null',
    'undefined',
    'id',
    'Id',
    'rraReferenceKey',
    'version',
    'createdAt',
    'updatedAt',
    'state',
];

const dateKeys = ['persDocIssueDate', 'persDocExpiryDate', 'dateOfBirth', 'dateOfIncorporation'];

const countryKeys = ['nationality', 'persDocIssuePlace', 'personDocIssuePlace'];

interface KeyValueListProps {
    children: ReactNode;
    className?: string;
}

/** The `<dl>` grid that holds KeyValuePair rows. */
export const KeyValueList = ({ children, className }: KeyValueListProps) => (
    <dl className={cn('grid gap-3 md:grid-cols-2', className)}>{children}</dl>
);

interface KeyValuePairProps {
    /** Field key. Drives date/country formatting and hidden keys; also the label when `label` is omitted. */
    keyText: string;
    valueText?: string | boolean | number | ReactNode;
    /** Human label. Defaults to `keyText`, capitalized. */
    label?: ReactNode;
    icon?: IconType;
    emptyText?: string;
    className?: string;
    isLoading?: boolean;
}

/**
 * One label/value row inside a KeyValueList: a gray tile with a muted label and an ink value.
 */
export const KeyValuePair = ({
    keyText,
    valueText,
    label,
    icon,
    emptyText = '—',
    className,
    isLoading,
}: KeyValuePairProps) => {
    if (
        hiddenKeys.includes(keyText) ||
        (typeof valueText === 'object' && valueText !== null && !isValidElement(valueText))
    )
        return null;

    const isEmpty = valueText === null || valueText === undefined || valueText === '';

    let value: ReactNode = valueText as ReactNode;
    if (isEmpty) {
        value = <span className="font-normal text-(--placeholder)">{emptyText}</span>;
    } else if (typeof valueText === 'boolean') {
        value = (
            <span className="inline-flex items-center gap-1.5">
                {valueText ? 'Yes' : 'No'}
                <Icon
                    icon={valueText ? LuCircleCheck : LuX}
                    className={cn('size-4', valueText ? 'text-(--success)' : 'text-(--danger)')}
                />
            </span>
        );
    } else if (dateKeys.includes(keyText)) {
        value = formatDate(new Date(valueText as string), 'DD/MM/YYYY');
    } else if (countryKeys.includes(keyText)) {
        value = getCountryName(valueText as string);
    }

    return (
        <div
            className={cn(
                'grid min-w-0 gap-1 rounded-(--radius-control) bg-(--surface) px-3 py-2.5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:items-baseline sm:gap-3',
                icon && 'sm:grid-cols-[32px_minmax(0,2fr)_minmax(0,3fr)] sm:items-center',
                className
            )}
        >
            {icon && (
                <span className="hidden size-8 items-center justify-center rounded-(--radius-control) bg-(--signal-soft) text-(--signal) sm:flex">
                    <Icon icon={icon} className="size-4" />
                </span>
            )}
            <dt className="type-meta">{label ?? capitalizeString(keyText)}</dt>
            <dd className="min-w-0 break-words text-[13px] font-normal text-(--ink)">
                {isLoading ? <SkeletonLoader /> : value}
            </dd>
        </div>
    );
};

export default KeyValuePair;
