import {
  formatPhoneNumberIntl,
  isValidPhoneNumber,
} from "react-phone-number-input";

export const PHONE_INVALID_MESSAGE =
  "Enter a number that can be dialed in that country";

/**
 * Formats a stored number for display. Records written before numbers were
 * normalized are shown as they were entered rather than dropped.
 */
export const formatPhone = (value?: string | null) => {
  if (!value) return "";
  return formatPhoneNumberIntl(value) || value;
};

/**
 * A blank number means the person has none on file; anything else has to be a
 * number that can actually be dialed in the selected country.
 */
export const isPhoneValid = (value?: string | null) =>
  !value || value.trim() === "" || isValidPhoneNumber(value);

// Validation rules for a react-hook-form `Controller` around `PhoneField`.
export const phoneRules = {
  validate: (value?: string | null) =>
    isPhoneValid(value) || PHONE_INVALID_MESSAGE,
};
