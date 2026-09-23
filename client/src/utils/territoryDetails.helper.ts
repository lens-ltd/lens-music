import { ReleaseTerritoryDetail } from "@/types/models/releaseTerritoryDetail.types";

export type TerritoryDetailForm = {
  id?: string;
  title: string;
  displayArtistName: string;
  labelName: string;
};

export type TerritoryDetailForms = Record<string, TerritoryDetailForm>;

export const EMPTY_TERRITORY_DETAIL: TerritoryDetailForm = {
  title: "",
  displayArtistName: "",
  labelName: "",
};

export const hasTerritoryDetailContent = (form?: TerritoryDetailForm) =>
  Boolean(
    form?.title.trim() ||
      form?.displayArtistName.trim() ||
      form?.labelName.trim(),
  );

// MERGE SAVED TERRITORY DETAILS
// Saved overrides win over blank local entries, so they show. A local entry
// with edits keeps them but takes the saved id, so its next blur updates the
// override instead of posting a duplicate. Local entries without a saved
// override stay as they are.
export const mergeTerritoryDetailForms = (
  current: TerritoryDetailForms,
  saved: ReleaseTerritoryDetail[],
): TerritoryDetailForms => {
  const next: TerritoryDetailForms = { ...current };

  saved.forEach((detail) => {
    const local = current[detail.territory];

    if (local?.id) return;

    if (local && hasTerritoryDetailContent(local)) {
      next[detail.territory] = { ...local, id: detail.id };
      return;
    }

    next[detail.territory] = {
      id: detail.id,
      title: detail.title || "",
      displayArtistName: detail.displayArtistName || "",
      labelName: detail.labelName || "",
    };
  });

  return next;
};

// Overrides apply to every country when the selection is empty (worldwide).
export const isTerritoryInScope = (
  territory: string,
  selectedTerritories: string[],
) =>
  selectedTerritories.length === 0 || selectedTerritories.includes(territory);

// TERRITORY DETAILS TO REMOVE ON SAVE
// A saved override is deleted on Save when its country was unticked, the
// artist removed it, or every field was cleared.
export const getTerritoryDetailsToRemove = (
  forms: TerritoryDetailForms,
  selectedTerritories: string[],
  removedTerritories: string[],
): { territory: string; id: string }[] =>
  Object.entries(forms).flatMap(([territory, form]) => {
    if (!form.id) return [];
    const isRemoved =
      !isTerritoryInScope(territory, selectedTerritories) ||
      removedTerritories.includes(territory) ||
      !hasTerritoryDetailContent(form);
    return isRemoved ? [{ territory, id: form.id }] : [];
  });
