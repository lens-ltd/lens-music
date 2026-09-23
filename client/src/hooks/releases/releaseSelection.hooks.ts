import { SetStateAction, useCallback, useEffect, useMemo, useState } from "react";

const haveSameMembers = (first: string[], second: string[]) => {
  if (first.length !== second.length) return false;
  const secondSet = new Set(second);
  return first.every((item) => secondSet.has(item));
};

const NO_SELECTION: string[] = [];

type SelectionState = {
  releaseId?: string;
  saved: string[];
  selected: string[];
};

// RELEASE SELECTION
// A step's checkbox selection, loaded once per release id. A later refetch of
// the same release doesn't touch it, so unsaved ticks survive a cover-art
// upload or a save elsewhere. `saved` is undefined until the saved selection
// has loaded; `initial` replaces it as the starting selection (for example
// every store, when none is assigned yet).
export const useReleaseSelection = ({
  releaseId,
  saved,
  initial,
}: {
  releaseId?: string;
  saved?: string[];
  initial?: string[];
}) => {
  const [state, setState] = useState<SelectionState>({
    saved: [],
    selected: [],
  });

  useEffect(() => {
    if (!releaseId || !saved || state.releaseId === releaseId) return;
    setState({ releaseId, saved, selected: initial ?? saved });
  }, [releaseId, saved, initial, state.releaseId]);

  const setSelected = useCallback((value: SetStateAction<string[]>) => {
    setState((current) => ({
      ...current,
      selected:
        typeof value === "function" ? value(current.selected) : value,
    }));
  }, []);

  // Call after a successful save, so the saved selection becomes the baseline.
  const markSaved = useCallback((savedSelection?: string[]) => {
    setState((current) => ({
      ...current,
      saved: savedSelection ?? current.selected,
    }));
  }, []);

  const isReady = Boolean(releaseId) && state.releaseId === releaseId;
  const isDirty = useMemo(
    () => isReady && !haveSameMembers(state.selected, state.saved),
    [isReady, state.selected, state.saved],
  );

  return {
    selected: isReady ? state.selected : NO_SELECTION,
    setSelected,
    isDirty,
    isReady,
    markSaved,
  };
};
