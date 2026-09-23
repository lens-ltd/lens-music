import { describe, expect, it } from "vitest";
import { getApiErrorMessage } from "./errors.helper";

describe("getApiErrorMessage", () => {
  it("reads the message from an RTK Query error body", () => {
    expect(
      getApiErrorMessage({ status: 400, data: { message: "Title is required" } }),
    ).toBe("Title is required");
  });

  it("joins an array of validation messages", () => {
    expect(
      getApiErrorMessage({
        status: 400,
        data: { message: ["Title is required", "Genre is required"] },
      }),
    ).toBe("Title is required, Genre is required");
  });

  it("returns a string body as is", () => {
    expect(getApiErrorMessage({ status: 502, data: "Bad gateway" })).toBe(
      "Bad gateway",
    );
  });

  it("explains network failures in plain language", () => {
    expect(
      getApiErrorMessage({ status: "FETCH_ERROR", error: "TypeError: Failed to fetch" }),
    ).toMatch(/couldn't reach the server/);
  });

  it("uses a thrown Error's message", () => {
    expect(getApiErrorMessage(new Error("Step not found"))).toBe("Step not found");
  });

  it("falls back when there is no usable message", () => {
    expect(getApiErrorMessage(undefined, "Failed to save")).toBe("Failed to save");
    expect(getApiErrorMessage({ status: 500, data: {} }, "Failed to save")).toBe(
      "Failed to save",
    );
    expect(getApiErrorMessage({ status: 500, data: { message: "" } })).toBe(
      "Something went wrong. Please try again.",
    );
  });
});
