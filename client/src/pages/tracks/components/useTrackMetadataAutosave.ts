import { Track } from "@/types/models/track.types";
import { useCallback, useMemo, useState } from "react";
import { UseFormGetValues } from "react-hook-form";
import {
  detailFields,
  FormField,
  FormValues,
  getTrackFieldValue,
  normalizeFormFieldValue,
  rightsFields,
  SaveState,
} from "./trackForm.helpers";

type UseTrackMetadataAutosaveParams = {
  track?: Track;
  trackId?: string;
  getValues: UseFormGetValues<FormValues>;
  getTrack: (arg: { id: string }) => unknown;
  updateTrack: (arg: {
    id: string;
    body: Partial<Record<FormField, string | number | boolean | null>>;
  }) => { unwrap: () => Promise<unknown> };
  onResetValidationResult: () => void;
  onError: (message: string) => void;
};

const useTrackMetadataAutosave = ({
  track,
  trackId,
  getValues,
  getTrack,
  updateTrack,
  onResetValidationResult,
  onError,
}: UseTrackMetadataAutosaveParams) => {
  const [saveStates, setSaveStates] = useState<Record<FormField, SaveState>>(
    {} as Record<FormField, SaveState>,
  );

  const setFieldState = useCallback((field: FormField, state: SaveState) => {
    setSaveStates((prev) => ({ ...prev, [field]: state }));
  }, []);

  const persistFieldUpdate = useCallback(
    async (field: FormField, rawValue?: string | boolean) => {
      if (!trackId) return;

      const nextRawValue = rawValue ?? getValues(field);
      const nextValue = normalizeFormFieldValue(field, nextRawValue);
      const currentValue = getTrackFieldValue(track, field);

      if (nextValue === currentValue) {
        setFieldState(field, "idle");
        return;
      }

      setFieldState(field, "saving");
      onResetValidationResult();

      try {
        await updateTrack({
          id: trackId,
          body: { [field]: nextValue },
        }).unwrap();

        setFieldState(field, "saved");
        getTrack({ id: trackId });
      } catch (error) {
        setFieldState(field, "failed");
        const errorMessage =
          (error as { data?: { message?: string } })?.data?.message ||
          "Unable to save track changes.";
        onError(errorMessage);
      }
    },
    [
      getTrack,
      getValues,
      onError,
      onResetValidationResult,
      setFieldState,
      track,
      trackId,
      updateTrack,
    ],
  );

  const getSectionStateLabel = useCallback(
    (fields: FormField[]) => {
      const states = fields.map((field) => saveStates[field] || "idle");

      if (states.includes("saving")) return "Saving...";
      if (states.includes("failed")) return "Could not save";
      if (states.includes("saved")) return "Saved";
      return null;
    },
    [saveStates],
  );

  const detailStateLabel = useMemo(
    () => getSectionStateLabel(detailFields),
    [getSectionStateLabel],
  );
  const rightsStateLabel = useMemo(
    () => getSectionStateLabel(rightsFields),
    [getSectionStateLabel],
  );

  return {
    detailStateLabel,
    persistFieldUpdate,
    rightsStateLabel,
  };
};

export default useTrackMetadataAutosave;
