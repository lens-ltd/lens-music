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

/**
 * GET STATUS BACKGROUND COLOR
 * @param status - The status to get the background color for
 * @returns The background color
 */
export const getStatusBackgroundColor = (status?: string) => {
  // Default classes
  let bgColor =
    'bg-gray-700 text-center p-1 px-3 text-white rounded-md text-[11px]';

  switch (status) {
    case 'DRAFT':
    case 'PENDING':
      bgColor =
        'bg-yellow-800 text-center p-1 px-3 text-white rounded-md text-[11px]';
      break;
    case 'REVIEW':
      bgColor =
        'bg-primary text-center p-1 px-3 text-white rounded-md text-[11px]';
      break;
    case 'APPROVED':
    case 'VERIFIED':
    case 'ACTIVE':
    case 'COMPLETED':
      bgColor =
        'bg-green-700 text-center p-1 px-3 text-white rounded-md text-[11px]';
      break;
    case 'DELIVERED':
      bgColor =
        'bg-primary text-center p-1 px-3 text-white rounded-md text-[11px]';
      break;
    case 'LIVE':
      bgColor =
        'bg-primary text-center p-1 px-3 text-white rounded-md text-[11px]';
      break;
    case 'TAKENDOWN':
    case 'REVOKED':
    case 'FAILED':
      bgColor =
        'bg-red-700 text-center p-1 px-3 text-white rounded-md text-[11px]';
      break;
    case 'INACTIVE':
      bgColor =
        'bg-gray-700 text-center p-1 px-3 text-white rounded-md text-[11px]';
      break;
    default:
      // fallback for unknown statuses
      bgColor =
        'bg-gray-700 text-center p-1 px-3 text-white rounded-md text-[11px]';
  }
  return bgColor;
};
