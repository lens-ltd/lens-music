import { CalendarIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChangeEvent, useState, useMemo, useEffect } from 'react';
import moment from 'moment';
import Select from './Select';

type DatePickerProps = {
  value: Date | string | undefined;
  onChange: ((e: ChangeEvent<HTMLInputElement>) => void) | undefined;
  selectionType?: 'date' | 'month' | 'year' | 'recurringDate' | undefined;
  fromDate?: Date;
  placeholder?: string;
  toDate?: Date;
  disabled?: boolean;
};

const DatePicker = ({
  onChange,
  value = undefined,
  selectionType,
  fromDate = undefined,
  placeholder = 'Select date',
  toDate = undefined,
  disabled = false,
}: DatePickerProps) => {
  // Normalize value to Date object (handles string values from react-hook-form)
  const normalizedValue = useMemo(() => {
    if (!value) return undefined;
    if (value instanceof Date) return isNaN(value.getTime()) ? undefined : value;
    const parsed = moment(value);
    return parsed.isValid() ? parsed.toDate() : undefined;
  }, [value]);

  // Calculate valid year range
  const validYearRange = useMemo(() => {
    const minYear = fromDate ? fromDate.getFullYear() : 1900;
    const maxYear = toDate ? toDate.getFullYear() : 2199;
    return { minYear, maxYear };
  }, [fromDate, toDate]);

  // SET MONTH AND YEAR - lazy initializers consider value prop and avoid running every render
  const [year, setYear] = useState<string | undefined>(() => {
    if (normalizedValue) return String(normalizedValue.getFullYear());

    const now = moment();
    const currentYear = now.year();

    if (
      (!fromDate || now.isSameOrAfter(moment(fromDate), 'day')) &&
      (!toDate || now.isSameOrBefore(moment(toDate), 'day'))
    ) {
      return String(currentYear);
    }
    if (fromDate) return String(fromDate.getFullYear());
    if (toDate) return String(toDate.getFullYear());
    return String(currentYear);
  });

  const [defaultMonth, setDefaultMonth] = useState<Date | undefined>(() => {
    if (normalizedValue) return normalizedValue;

    const now = moment();
    const currentMonth = now.toDate();

    if (
      (!fromDate || now.isSameOrAfter(moment(fromDate), 'day')) &&
      (!toDate || now.isSameOrBefore(moment(toDate), 'day'))
    ) {
      return currentMonth;
    }
    if (fromDate) return fromDate;
    if (toDate) return toDate;
    return currentMonth;
  });

  const [open, setOpen] = useState(false);

  // Sync calendar view when value changes externally (API data load, form reset)
  useEffect(() => {
    if (normalizedValue) {
      setYear(String(normalizedValue.getFullYear()));
      setDefaultMonth(normalizedValue);
    }
  }, [normalizedValue]);

  // Stable timestamps to avoid re-running the effect when the same date is passed
  // as a new object reference (e.g. `toDate={new Date()}` re-creates every render).
  const fromDateTs = fromDate ? moment(fromDate).startOf('day').valueOf() : undefined;
  const toDateTs = toDate ? moment(toDate).startOf('day').valueOf() : undefined;

  // Sync calendar view to boundary dates when no value is selected.
  // Handles cases where fromDate/toDate are computed/async and not available
  // on first render — e.g. fromDate in the future means the picker should open
  // at fromDate, not today, so the user doesn't have to navigate manually.
  useEffect(() => {
    if (normalizedValue) return;

    const now = moment();
    const isNowInRange =
      (fromDateTs === undefined || now.startOf('day').valueOf() >= fromDateTs) &&
      (toDateTs === undefined || now.startOf('day').valueOf() <= toDateTs);

    if (isNowInRange) {
      setDefaultMonth(now.toDate());
      setYear(String(now.year()));
    } else if (fromDate) {
      setDefaultMonth(fromDate);
      setYear(String(fromDate.getFullYear()));
    } else if (toDate) {
      setDefaultMonth(toDate);
      setYear(String(toDate.getFullYear()));
    }
  // Use stable timestamps so a new Date object with the same value doesn't
  // re-trigger this effect and reset the month the user navigated to.
  // normalizedValue intentionally omitted — this effect only handles boundary changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDateTs, toDateTs]);

  // Calculate valid months for the selected year
  const validMonths = useMemo(() => {
    if (!year) return [];

    const selectedYear = parseInt(year);
    const months: Array<{ value: string; label: string }> = [];

    for (let i = 0; i < 12; i++) {
      const monthStart = moment(`${selectedYear}-${String(i + 1).padStart(2, '0')}-01`, 'YYYY-MM-DD');
      const monthEnd = monthStart.clone().endOf('month');

      // Check if this month has any valid dates within the range
      const hasValidDates =
        (!fromDate || monthEnd.isSameOrAfter(moment(fromDate), 'day')) &&
        (!toDate || monthStart.isSameOrBefore(moment(toDate), 'day'));

      if (hasValidDates) {
        months.push({
          value: String(i + 1).padStart(2, '0'),
          label: moment().month(i).format('MMM'),
        });
      }
    }

    return months;
  }, [year, fromDate, toDate]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            'field-chrome flex items-center justify-start text-left font-normal',
            !normalizedValue && 'text-(--muted)'
          )}
          onClick={() => setOpen(!open)}
        >
          <CalendarIcon className="w-4 h-4 mr-2 text-(--muted)" />
          {normalizedValue ? (
            selectionType === 'recurringDate' ? (
              moment(normalizedValue).format('MMMM DD')
            ) : !['date', 'month', 'year'].includes(String(selectionType)) ? (
              moment(normalizedValue).format('MMMM Do, YYYY')
            ) : (
              moment(normalizedValue).format('MMMM DD')
            )
          ) : (
            <span className="type-body-sm text-(--muted)">{placeholder}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 card-framed shadow-[var(--shadow-menu)]" align="start">
        <menu className="flex flex-col w-full gap-3 p-4">
          <ul
            className={`w-full grid gap-3 p-0 ${selectionType === 'recurringDate' ? 'grid-cols-1' : 'grid-cols-2'
              }`}
          >
            {selectionType !== 'recurringDate' && (
              <Select
                placeholder="Year"
                onChange={(e) => {
                  setYear(e);
                  // Update defaultMonth to the selected year, preserving month if valid
                  if (defaultMonth) {
                    const newYear = parseInt(e);
                    const currentMonthValue = moment(defaultMonth).format('MM');

                    // Calculate valid months for the new year
                    const monthsForNewYear: Array<{ value: string; label: string }> = [];
                    for (let i = 0; i < 12; i++) {
                      const monthStart = moment(`${newYear}-${String(i + 1).padStart(2, '0')}-01`, 'YYYY-MM-DD');
                      const monthEnd = monthStart.clone().endOf('month');

                      const hasValidDates =
                        (!fromDate || monthEnd.isSameOrAfter(moment(fromDate), 'day')) &&
                        (!toDate || monthStart.isSameOrBefore(moment(toDate), 'day'));

                      if (hasValidDates) {
                        monthsForNewYear.push({
                          value: String(i + 1).padStart(2, '0'),
                          label: moment().month(i).format('MMM'),
                        });
                      }
                    }

                    // Check if current month is valid for new year
                    const isCurrentMonthValid = monthsForNewYear.some(m => m.value === currentMonthValue);

                    if (isCurrentMonthValid && monthsForNewYear.length > 0) {
                      // Preserve month number, update year
                      setDefaultMonth(moment(`${newYear}-${currentMonthValue}-01`, 'YYYY-MM-DD').toDate());
                    } else if (monthsForNewYear.length > 0) {
                      // Use first valid month of new year
                      const firstValidMonth = monthsForNewYear[0];
                      setDefaultMonth(moment(`${newYear}-${firstValidMonth.value}-01`, 'YYYY-MM-DD').toDate());
                    }
                  }
                }}
                value={year}
                options={Array.from(
                  { length: validYearRange.maxYear - validYearRange.minYear + 1 },
                  (_, i) => ({
                    value: String(validYearRange.maxYear - i),
                    label: String(validYearRange.maxYear - i),
                  })
                )}
              />
            )}
            <Select
              placeholder="Month"
              onChange={(e) => {
                setDefaultMonth(moment(`${year}-${e}`, 'YYYY-MM-DD').toDate());
              }}
              value={moment(defaultMonth).format('MM')}
              options={validMonths}
            />
          </ul>
          <Calendar
            fromDate={fromDate}
            toDate={toDate}
            mode="single"
            month={defaultMonth}
            onMonthChange={(e) => {
              if (selectionType !== 'recurringDate') {
                setDefaultMonth(e);
                setYear(String(e.getFullYear()));
              }
            }}
            selected={normalizedValue}
            onSelect={(e) => {
              if (e) {
                if (onChange) {
                  onChange(e as unknown as ChangeEvent<HTMLInputElement>);
                }
                setOpen(false);
              }
            }}
            modifiers={{
              hidden: (date) => {
                if (fromDate && moment(date).isBefore(moment(fromDate), 'day')) {
                  return true;
                }
                if (toDate && moment(date).isAfter(moment(toDate), 'day')) {
                  return true;
                }
                return false;
              },
            }}
            modifiersClassNames={{
              hidden: 'day_hidden',
            }}
            initialFocus
            className="bg-transparent"
          />
        </menu>
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
