import { ReleaseParentalAdvisory } from "@/types/models/release.types";
import { Track } from "@/types/models/track.types";

export type FormField =
  | "title"
  | "titleVersion"
  | "isrc"
  | "iswc"
  | "discNumber"
  | "trackNumber"
  | "bpm"
  | "musicalKey"
  | "parentalAdvisory"
  | "primaryLanguage"
  | "previewStartMs"
  | "isBonusTrack"
  | "isHiddenTrack"
  | "cLineYear"
  | "cLineOwner"
  | "pLineYear"
  | "pLineOwner";

export type FormValues = Record<FormField, string | boolean>;
export type SaveState = "idle" | "saving" | "saved" | "failed";
export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

/** Minimum trimmed length before contributor search runs (aligned with track editor UI). */
export const MIN_CONTRIBUTOR_SEARCH_CHARS = 2;

export const defaultFormValues: FormValues = {
  title: "",
  titleVersion: "",
  isrc: "",
  iswc: "",
  discNumber: "1",
  trackNumber: "1",
  bpm: "",
  musicalKey: "",
  parentalAdvisory: ReleaseParentalAdvisory.NOT_EXPLICIT,
  primaryLanguage: "",
  previewStartMs: "",
  isBonusTrack: false,
  isHiddenTrack: false,
  cLineYear: "",
  cLineOwner: "",
  pLineYear: "",
  pLineOwner: "",
};

export const nullableStringFields: FormField[] = [
  "titleVersion",
  "isrc",
  "iswc",
  "bpm",
  "musicalKey",
  "primaryLanguage",
  "cLineOwner",
  "pLineOwner",
];

export const nullableNumberFields: FormField[] = [
  "previewStartMs",
  "cLineYear",
  "pLineYear",
];

export const requiredNumberFields: FormField[] = ["discNumber", "trackNumber"];

export const detailFields: FormField[] = [
  "title",
  "titleVersion",
  "isrc",
  "iswc",
  "discNumber",
  "trackNumber",
  "bpm",
  "musicalKey",
  "parentalAdvisory",
  "primaryLanguage",
  "previewStartMs",
];

export const rightsFields: FormField[] = [
  "cLineYear",
  "cLineOwner",
  "pLineYear",
  "pLineOwner",
  "isBonusTrack",
  "isHiddenTrack",
];

export const parentalAdvisoryOptions = Object.values(ReleaseParentalAdvisory);

export const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const formatDuration = (durationMs?: number) => {
  if (!durationMs) return "0:00";

  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

export const getFormDefaults = (track?: Track): FormValues => ({
  title: track?.title ?? "",
  titleVersion: track?.titleVersion ?? "",
  isrc: track?.isrc ?? "",
  iswc: track?.iswc ?? "",
  discNumber: track?.discNumber ? String(track.discNumber) : "1",
  trackNumber: track?.trackNumber ? String(track.trackNumber) : "1",
  bpm: track?.bpm ?? "",
  musicalKey: track?.musicalKey ?? "",
  parentalAdvisory:
    track?.parentalAdvisory ?? ReleaseParentalAdvisory.NOT_EXPLICIT,
  primaryLanguage: track?.primaryLanguage ?? "",
  previewStartMs:
    track?.previewStartMs === null || track?.previewStartMs === undefined
      ? ""
      : String(track.previewStartMs),
  isBonusTrack: track?.isBonusTrack ?? false,
  isHiddenTrack: track?.isHiddenTrack ?? false,
  cLineYear:
    track?.cLineYear === null || track?.cLineYear === undefined
      ? ""
      : String(track.cLineYear),
  cLineOwner: track?.cLineOwner ?? "",
  pLineYear:
    track?.pLineYear === null || track?.pLineYear === undefined
      ? ""
      : String(track.pLineYear),
  pLineOwner: track?.pLineOwner ?? "",
});

export const normalizeFormFieldValue = (
  field: FormField,
  value: string | boolean,
) => {
  if (field === "isBonusTrack" || field === "isHiddenTrack") {
    return Boolean(value);
  }

  if (requiredNumberFields.includes(field)) {
    return value === "" ? 1 : Number(value);
  }

  if (nullableNumberFields.includes(field)) {
    return value === "" ? null : Number(value);
  }

  if (nullableStringFields.includes(field)) {
    return value === "" ? null : String(value).trim();
  }

  if (field === "parentalAdvisory") {
    return value;
  }

  return String(value);
};

export const getTrackFieldValue = (track: Track | undefined, field: FormField) => {
  if (!track) return null;

  switch (field) {
    case "discNumber":
      return track.discNumber;
    case "trackNumber":
      return track.trackNumber;
    case "previewStartMs":
      return track.previewStartMs ?? null;
    case "cLineYear":
      return track.cLineYear ?? null;
    case "pLineYear":
      return track.pLineYear ?? null;
    case "isBonusTrack":
      return track.isBonusTrack;
    case "isHiddenTrack":
      return track.isHiddenTrack;
    case "title":
      return track.title;
    case "titleVersion":
      return track.titleVersion ?? null;
    case "isrc":
      return track.isrc ?? null;
    case "iswc":
      return track.iswc ?? null;
    case "bpm":
      return track.bpm ?? null;
    case "musicalKey":
      return track.musicalKey ?? null;
    case "parentalAdvisory":
      return track.parentalAdvisory;
    case "primaryLanguage":
      return track.primaryLanguage ?? null;
    case "cLineOwner":
      return track.cLineOwner ?? null;
    case "pLineOwner":
      return track.pLineOwner ?? null;
    default:
      return null;
  }
};
