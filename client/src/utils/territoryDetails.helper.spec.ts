import { describe, expect, it } from "vitest";
import { ReleaseTerritoryDetail } from "@/types/models/releaseTerritoryDetail.types";
import {
  EMPTY_TERRITORY_DETAIL,
  getTerritoryDetailsToRemove,
  mergeTerritoryDetailForms,
} from "./territoryDetails.helper";

const savedDetail = (
  overrides: Partial<ReleaseTerritoryDetail>,
): ReleaseTerritoryDetail =>
  ({
    id: "detail-fr",
    releaseId: "release-1",
    territory: "FR",
    title: "Titre",
    displayArtistName: "Artiste",
    labelName: "",
    ...overrides,
  }) as ReleaseTerritoryDetail;

describe("mergeTerritoryDetailForms", () => {
  it("keeps a saved override over a blank local entry", () => {
    const merged = mergeTerritoryDetailForms(
      { FR: EMPTY_TERRITORY_DETAIL },
      [savedDetail({})],
    );

    expect(merged.FR).toEqual({
      id: "detail-fr",
      title: "Titre",
      displayArtistName: "Artiste",
      labelName: "",
    });
  });

  it("keeps local edits but takes the saved id, so a blur updates instead of posting again", () => {
    const merged = mergeTerritoryDetailForms(
      { FR: { ...EMPTY_TERRITORY_DETAIL, title: "Nouveau titre" } },
      [savedDetail({})],
    );

    expect(merged.FR).toEqual({
      id: "detail-fr",
      title: "Nouveau titre",
      displayArtistName: "",
      labelName: "",
    });
  });

  it("doesn't overwrite a loaded override on a refetch", () => {
    const current = {
      FR: { id: "detail-fr", title: "Edited", displayArtistName: "", labelName: "" },
    };

    expect(mergeTerritoryDetailForms(current, [savedDetail({})])).toEqual(current);
  });

  it("keeps local entries that have no saved override", () => {
    const merged = mergeTerritoryDetailForms(
      { DE: { ...EMPTY_TERRITORY_DETAIL, title: "Titel" } },
      [savedDetail({})],
    );

    expect(Object.keys(merged).sort()).toEqual(["DE", "FR"]);
    expect(merged.DE.id).toBeUndefined();
  });
});

describe("getTerritoryDetailsToRemove", () => {
  const forms = {
    FR: { id: "detail-fr", title: "Titre", displayArtistName: "", labelName: "" },
    DE: { id: "detail-de", title: "Titel", displayArtistName: "", labelName: "" },
    ES: { title: "Título", displayArtistName: "", labelName: "" },
  };

  it("removes saved overrides for unticked countries", () => {
    expect(getTerritoryDetailsToRemove(forms, ["DE", "ES"], [])).toEqual([
      { territory: "FR", id: "detail-fr" },
    ]);
  });

  it("keeps every override when the release is worldwide", () => {
    expect(getTerritoryDetailsToRemove(forms, [], [])).toEqual([]);
  });

  it("removes overrides the artist removed or cleared", () => {
    const cleared = {
      ...forms,
      DE: { id: "detail-de", title: " ", displayArtistName: "", labelName: "" },
    };

    expect(getTerritoryDetailsToRemove(cleared, [], ["FR"])).toEqual([
      { territory: "FR", id: "detail-fr" },
      { territory: "DE", id: "detail-de" },
    ]);
  });
});
