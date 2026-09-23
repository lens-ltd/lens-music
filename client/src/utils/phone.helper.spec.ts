import { describe, expect, it } from "vitest";
import {
  PHONE_INVALID_MESSAGE,
  formatPhone,
  isPhoneValid,
  phoneRules,
} from "./phone.helper";

describe("formatPhone", () => {
  it("formats a stored E.164 number for display", () => {
    expect(formatPhone("+250788123456")).toBe("+250 788 123 456");
  });

  it("shows legacy free-form numbers as they were entered", () => {
    expect(formatPhone("0788 123 456")).toBe("0788 123 456");
  });

  it("returns an empty string when there is no number", () => {
    expect(formatPhone(undefined)).toBe("");
    expect(formatPhone(null)).toBe("");
  });
});

describe("isPhoneValid and phoneRules", () => {
  it("accepts an empty value, since phones are optional", () => {
    expect(isPhoneValid("")).toBe(true);
    expect(isPhoneValid(undefined)).toBe(true);
  });

  it("accepts a dialable number and rejects one that is too short", () => {
    expect(isPhoneValid("+250788123456")).toBe(true);
    expect(isPhoneValid("+25078")).toBe(false);
    expect(phoneRules.validate("+25078")).toBe(PHONE_INVALID_MESSAGE);
  });
});

