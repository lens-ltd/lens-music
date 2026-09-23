import { Transform } from 'class-transformer';
import { IsOptional, IsPhoneNumber, MaxLength } from 'class-validator';
import {
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js';

export const PHONE_INVALID_MESSAGE =
  'Enter a number that can be dialed in that country';

/**
 * Canonicalizes a submitted number to E.164 so a person is stored and searched
 * the same way regardless of how the number was typed. A blank value becomes
 * `null`, which clears the number. Values that cannot be parsed are passed
 * through untouched for validation to reject.
 */
export function normalizePhoneNumber(
  value: unknown,
  defaultCountry?: CountryCode,
): unknown {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = parsePhoneNumberFromString(trimmed, defaultCountry);
  return parsed?.isValid() ? parsed.number : trimmed;
}

/**
 * The digits to match a search key against stored numbers, or `undefined` when
 * the key doesn't look like part of a phone number (fewer than 3 digits, or
 * letters). A full local number is expanded with the default country, and a
 * national trunk `0` is dropped, since stored E.164 numbers never contain it.
 */
export function phoneSearchDigits(
  searchKey: string,
  defaultCountry: CountryCode = 'RW',
): string | undefined {
  const trimmed = searchKey.trim();
  if (!/^[+\d\s().-]+$/.test(trimmed)) return undefined;
  const normalized = normalizePhoneNumber(trimmed, defaultCountry);
  const source =
    typeof normalized === 'string' && normalized.startsWith('+')
      ? normalized
      : trimmed.replace(/^0+/, '');
  const digits = source.replace(/\D/g, '');
  return digits.length >= 3 ? digits : undefined;
}

/**
 * An optional phone number on a request body. The client sends E.164, so the
 * number must carry its country calling code.
 */
export function PhoneNumberField(): PropertyDecorator {
  return (target, propertyKey) => {
    IsOptional()(target, propertyKey);
    Transform(({ value }) => normalizePhoneNumber(value))(target, propertyKey);
    IsPhoneNumber(undefined, { message: PHONE_INVALID_MESSAGE })(
      target,
      propertyKey,
    );
    MaxLength(40)(target, propertyKey);
  };
}
