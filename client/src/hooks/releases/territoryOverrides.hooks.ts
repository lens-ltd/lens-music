import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/errors.helper";
import {
  EMPTY_TERRITORY_DETAIL,
  TerritoryDetailForm,
  TerritoryDetailForms,
  getTerritoryDetailsToRemove,
  hasTerritoryDetailContent,
  isTerritoryInScope,
  mergeTerritoryDetailForms,
} from "@/utils/territoryDetails.helper";
import { ReleaseTerritoryDetail } from "@/types/models/releaseTerritoryDetail.types";
import {
  useCreateReleaseTerritoryDetail,
  useDeleteReleaseTerritoryDetail,
  useFetchReleaseTerritoryDetails,
  useUpdateReleaseTerritoryDetail,
} from "./release-territory-detail.hooks";

type TerritoryDetailField = keyof Omit<TerritoryDetailForm, "id">;

// RELEASE TERRITORY OVERRIDES
// Per-country title, artist and label overrides for the Regions step. Edits
// save when a field loses focus. Removals (an unticked country, a removed or
// cleared override) wait for the step's Save, through `removePendingOverrides`.
export const useReleaseTerritoryOverrides = ({
  releaseId,
  selectedTerritories,
}: {
  releaseId?: string;
  selectedTerritories: string[];
}) => {
  const {
    fetchReleaseTerritoryDetails,
    data,
    isFetching,
    isError,
    error,
  } = useFetchReleaseTerritoryDetails();
  const { createReleaseTerritoryDetail } = useCreateReleaseTerritoryDetail();
  const { updateReleaseTerritoryDetail } = useUpdateReleaseTerritoryDetail();
  const { deleteReleaseTerritoryDetail } = useDeleteReleaseTerritoryDetail();

  const [forms, setForms] = useState<TerritoryDetailForms>({});
  const [removedTerritories, setRemovedTerritories] = useState<string[]>([]);

  // Blur handlers read the latest forms here, since a save can finish between
  // renders; `updateForms` keeps it and the state in step.
  const formsRef = useRef<TerritoryDetailForms>({});
  // One create per country at a time, so two quick blurs can't post twice.
  const pendingCreates = useRef<Record<string, Promise<void>>>({});

  const updateForms = useCallback(
    (update: (current: TerritoryDetailForms) => TerritoryDetailForms) => {
      formsRef.current = update(formsRef.current);
      setForms(formsRef.current);
    },
    [],
  );

  const fetchDetails = useCallback(() => {
    if (releaseId) fetchReleaseTerritoryDetails({ releaseId });
  }, [fetchReleaseTerritoryDetails, releaseId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  useEffect(() => {
    const saved: ReleaseTerritoryDetail[] | undefined = data?.data;
    if (!saved) return;
    updateForms((current) => mergeTerritoryDetailForms(current, saved));
  }, [data, updateForms]);

  // Countries listed in the overrides section.
  const overrideTerritories = useMemo(
    () =>
      Object.keys(forms)
        .filter(
          (territory) =>
            isTerritoryInScope(territory, selectedTerritories) &&
            !removedTerritories.includes(territory),
        )
        .sort(),
    [forms, removedTerritories, selectedTerritories],
  );

  const pendingRemovals = useMemo(
    () =>
      getTerritoryDetailsToRemove(forms, selectedTerritories, removedTerritories),
    [forms, removedTerritories, selectedTerritories],
  );

  const addOverride = useCallback(
    (territory: string) => {
      setRemovedTerritories((current) =>
        current.filter((item) => item !== territory),
      );
      updateForms((current) =>
        current[territory]
          ? current
          : { ...current, [territory]: EMPTY_TERRITORY_DETAIL },
      );
    },
    [updateForms],
  );

  const removeOverride = useCallback(
    (territory: string) => {
      if (formsRef.current[territory]?.id) {
        setRemovedTerritories((current) =>
          current.includes(territory) ? current : [...current, territory],
        );
        return;
      }
      updateForms((current) => {
        const next = { ...current };
        delete next[territory];
        return next;
      });
    },
    [updateForms],
  );

  const updateField = useCallback(
    (territory: string, field: TerritoryDetailField, value: string) => {
      updateForms((current) => ({
        ...current,
        [territory]: {
          ...(current[territory] || EMPTY_TERRITORY_DETAIL),
          [field]: value,
        },
      }));
    },
    [updateForms],
  );

  const persistOverride = useCallback(
    async (territory: string) => {
      if (!releaseId) return;
      await pendingCreates.current[territory];

      const detail = formsRef.current[territory];
      // A cleared override is removed on Save, not on blur.
      if (!detail || !hasTerritoryDetailContent(detail)) return;

      const payload = {
        territory,
        title: detail.title.trim() || undefined,
        displayArtistName: detail.displayArtistName.trim() || undefined,
        labelName: detail.labelName.trim() || undefined,
      };

      try {
        if (detail.id) {
          await updateReleaseTerritoryDetail({
            releaseId,
            detailId: detail.id,
            body: payload,
          }).unwrap();
          return;
        }

        const create = createReleaseTerritoryDetail({
          releaseId,
          body: payload,
        })
          .unwrap()
          .then((response) => {
            const id: string | undefined = response?.data?.id;
            updateForms((current) => ({
              ...current,
              [territory]: {
                ...(current[territory] || EMPTY_TERRITORY_DETAIL),
                id,
              },
            }));
          });
        const tracked = create.catch(() => undefined);
        pendingCreates.current[territory] = tracked;
        try {
          await create;
        } finally {
          if (pendingCreates.current[territory] === tracked) {
            delete pendingCreates.current[territory];
          }
        }
      } catch (error) {
        toast.error(
          getApiErrorMessage(
            error,
            `Unable to save territory detail for ${territory}.`,
          ),
        );
      }
    },
    [
      releaseId,
      createReleaseTerritoryDetail,
      updateReleaseTerritoryDetail,
      updateForms,
    ],
  );

  // Deletes the overrides waiting for removal. Throws on the first failure, so
  // the step stays open and can show the error.
  const removePendingOverrides = useCallback(async () => {
    if (!releaseId) return;

    for (const { territory, id } of pendingRemovals) {
      await deleteReleaseTerritoryDetail({ releaseId, detailId: id }).unwrap();
      updateForms((current) => {
        const next = { ...current };
        delete next[territory];
        return next;
      });
    }
    setRemovedTerritories([]);
  }, [
    releaseId,
    pendingRemovals,
    deleteReleaseTerritoryDetail,
    updateForms,
  ]);

  return {
    forms,
    overrideTerritories,
    pendingRemovals,
    isFetching,
    isError,
    error,
    refetch: fetchDetails,
    addOverride,
    removeOverride,
    updateField,
    persistOverride,
    removePendingOverrides,
  };
};
