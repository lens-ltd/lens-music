import { COUNTRIES_LIST } from '@/constants/countries.constants';
import moment from 'moment';

/**
 * FORMAT PHONE
 * @param phone - The phone number to format
 * @returns The formatted phone number
 */
export const formatPhone = (phone: string, countryCode: string = 'RW') => {
  if (!phone || phone === 'null') return '';
  if (countryCode) {
    const dialCode = COUNTRIES_LIST.find((country) => country.code === countryCode)?.dial_code;
    if (dialCode) {
      return `${dialCode?.replace('+', '')}${phone?.slice(-9)}`;
    } else {
      return `250${phone?.slice(-9)}`;
    }
  }
  return `250${phone?.slice(-9)}`;
};

/**
 * FORMAT DATE
 * @param date - The date to format
 * @param format - The format to use
 * @returns The formatted date
 */
export const formatDate = (
  date: string | Date | undefined,
  format: string = 'YYYY-MM-DD'
) => {
  if (!date) return '';
  return moment(date).format(format);
};

/**
 * FORMAT TIME
 * @param time - The time to format
 * @param format - The format to use
 * @returns The formatted time
 */
export const formatTime = (
  time: string | Date | undefined,
  format: string = 'HH:mm:ss'
) => {
  if (!time) return '';
  return moment(time, format).format(format);
};

/**
 * CAPITALIZE STRING
 * @param string - The string to capitalize
 * @returns The capitalized string
 */
export const capitalizeString = (
  string: string | undefined | null | number
) => {
  if (!string || typeof string !== 'string') return '';
  const isCamelCase = /^[a-z]+([A-Z][a-z]*)*$/.test(string);
  if (isCamelCase) return capitalizeCamelCase(string);
  if (
    string.includes('@') ||
    string.includes('true') ||
    string.includes('false')
  )
    return string; // Avoid capitalizing email addresses and boolean values
  const words = string?.toLowerCase()?.split('_');
  const capitalizedWords =
    words && words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return capitalizedWords && capitalizedWords.join(' ');
};

/**
 * CAPITALIZE CAMEL CASE
 * @param string - The string to capitalize
 * @returns The capitalized string
 */
export function capitalizeCamelCase(string: string) {
  return string
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, function (str) {
      return str.toUpperCase();
    })
    .trim();
}

/**
 * FORMAT NUMBERS
 * @param number - The number to format
 * @returns The formatted number
 */
export const formatNumbers = (number?: number | string) => {
  if (number === undefined || number === null || number === '') return '';
  return new Intl.NumberFormat().format(Number(number));
};

/**
 * REMOVE DUPLICATES FROM ARRAY
 * @param array - The array to remove duplicates from
 * @returns The array with duplicates removed
 */
export const removeArrayDuplicates = (array: object[]) => {
  return [...new Set(array)];
};

/**
 * FORMAT CURRENCY
 * @param amount - The amount to format
 * @param currency - The currency to use
 * @returns The formatted currency
 */
export const formatCurrency = (
  amount: number | string | undefined,
  currency: string = 'RWF'
) => {
  if (amount === undefined || amount === null || amount === '') return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(Number(amount));
};

/**
 * MASK PHONE DIGITS
 * @param phone - The phone number to mask
 * @returns The masked phone number
 */
export const maskPhoneDigits = (phone: string) => {
  return `${phone?.slice(0, 3)}X XXX ${phone?.slice(-3)}`;
};

export type StatusTone = 'success' | 'danger' | 'active' | 'neutral';

/**
 * Maps a backend status to one of four tones. Green and red are reserved
 * for outcomes; in-progress states use the brand blue; everything else is neutral.
 */
export const getStatusTone = (status?: string): StatusTone => {
  switch (status) {
    case 'APPROVED':
    case 'VERIFIED':
    case 'VALIDATED':
    case 'ACTIVE':
    case 'COMPLETED':
    case 'LIVE':
      return 'success';
    case 'REVIEW':
    case 'REQUESTED':
    case 'DELIVERED':
      return 'active';
    case 'TAKENDOWN':
    case 'REVOKED':
    case 'FAILED':
    case 'REJECTED':
    case 'DECLINED':
      return 'danger';
    default:
      return 'neutral';
  }
};

const statusToneClassNames: Record<StatusTone, string> = {
  success: 'bg-(--success-soft) text-(--success)',
  danger: 'bg-(--danger-soft) text-(--danger)',
  active: 'bg-(--signal-soft) text-(--signal)',
  neutral: 'bg-(--surface) text-(--ink)',
};

export const getStatusToneClassName = (tone: StatusTone) =>
  `inline-flex h-6 w-fit items-center whitespace-nowrap rounded-(--radius-pill) px-2.5 text-xs font-medium ${statusToneClassNames[tone]}`;

/** Badge classes for a status. Prefer the StatusBadge component in new code. */
export const getStatusBackgroundColor = (status?: string) =>
  getStatusToneClassName(getStatusTone(status));
