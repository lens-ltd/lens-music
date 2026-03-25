import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import Input from "@/components/inputs/Input";
import { COUNTRIES_LIST } from "@/constants/countries.constants";
import {
  useCreateReleaseTerritoryDetail,
  useDeleteReleaseTerritoryDetail,
  useFetchReleaseTerritoryDetails,
  useUpdateReleaseTerritoryDetail,
} from "@/hooks/releases/release-territory-detail.hooks";
import { ReleaseTerritoryDetail } from "@/types/models/releaseTerritoryDetail.types";

type DetailFormState = {
  id?: string;
  title: string;
  displayArtistName: string;
  labelName: string;
};

const EMPTY_DETAIL: DetailFormState = {
  title: "",
  displayArtistName: "",
  labelName: "",
};

const ReleaseTerritoryDetailsSection = ({
  releaseId,
  selectedTerritories,
}: {
  releaseId?: string;
  selectedTerritories: string[];
}) => {
  const { fetchReleaseTerritoryDetails, data } = useFetchReleaseTerritoryDetails();
  const { createReleaseTerritoryDetail } = useCreateReleaseTerritoryDetail();
  const { updateReleaseTerritoryDetail } = useUpdateReleaseTerritoryDetail();
  const { deleteReleaseTerritoryDetail } = useDeleteReleaseTerritoryDetail();

  const [detailForms, setDetailForms] = useState<Record<string, DetailFormState>>({});
  const previousTerritoriesRef = useRef<string[]>([]);

  const persistedDetails: ReleaseTerritoryDetail[] = useMemo(
    () => data?.data ?? [],
    [data?.data],
  );

  useEffect(() => {
    if (!releaseId) return;
    fetchReleaseTerritoryDetails({ releaseId });
  }, [fetchReleaseTerritoryDetails, releaseId]);

  useEffect(() => {
    const removedTerritories = previousTerritoriesRef.current.filter(
      (territory) => !selectedTerritories.includes(territory),
    );

    removedTerritories.forEach((territory) => {
      const current = detailForms[territory];
      if (releaseId && current?.id) {
        void deleteReleaseTerritoryDetail({
          releaseId,
          detailId: current.id,
        }).unwrap().catch(() => {
          toast.error(`Unable to remove territory override for ${territory}.`);
        });
      }
    });

    previousTerritoriesRef.current = selectedTerritories;
  }, [deleteReleaseTerritoryDetail, detailForms, releaseId, selectedTerritories]);

  useEffect(() => {
    setDetailForms((current) => {
      const next: Record<string, DetailFormState> = {};

      selectedTerritories.forEach((territory) => {
        const persisted = persistedDetails.find((item) => item.territory === territory);
        next[territory] = current[territory] || {
          id: persisted?.id,
          title: persisted?.title || "",
          displayArtistName: persisted?.displayArtistName || "",
          labelName: persisted?.labelName || "",
        };
      });

      return next;
    });
  }, [persistedDetails, selectedTerritories]);

  const updateField = (
    territory: string,
    field: keyof Omit<DetailFormState, "id">,
    value: string,
  ) => {
    setDetailForms((current) => ({
      ...current,
      [territory]: {
        ...(current[territory] || EMPTY_DETAIL),
        [field]: value,
      },
    }));
  };

  const persistTerritory = async (territory: string) => {
    if (!releaseId) return;

    const detail = detailForms[territory];
    if (!detail) return;

    const payload = {
      territory,
      title: detail.title.trim() || undefined,
      displayArtistName: detail.displayArtistName.trim() || undefined,
      labelName: detail.labelName.trim() || undefined,
    };

    const hasContent = Boolean(
      payload.title || payload.displayArtistName || payload.labelName,
    );

    try {
      if (!hasContent) {
        if (detail.id) {
          await deleteReleaseTerritoryDetail({
            releaseId,
            detailId: detail.id,
          }).unwrap();
          setDetailForms((current) => ({
            ...current,
            [territory]: EMPTY_DETAIL,
          }));
        }
        return;
      }

      if (detail.id) {
        await updateReleaseTerritoryDetail({
          releaseId,
          detailId: detail.id,
          body: payload,
        }).unwrap();
      } else {
        const response = await createReleaseTerritoryDetail({
          releaseId,
          body: payload,
        }).unwrap();
        setDetailForms((current) => ({
          ...current,
          [territory]: {
            ...(current[territory] || EMPTY_DETAIL),
            id: response.data?.id,
          },
        }));
      }
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        `Unable to save territory detail for ${territory}.`;
      toast.error(message);
    }
  };

  if (!releaseId || selectedTerritories.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl border border-[color:var(--lens-sand)]/70 bg-white p-4 sm:p-5">
      <header className="mb-4 space-y-1">
        <h3 className="text-sm font-medium text-[color:var(--lens-ink)]">
          Territory-specific metadata
        </h3>
        <p className="text-[12px] text-[color:var(--lens-ink)]/55">
          Add overrides only where title, display artist, or label name must
          differ by territory. Changes save when a field loses focus.
        </p>
      </header>

      <div className="grid gap-4">
        {selectedTerritories.map((territory) => {
          const detail = detailForms[territory] || EMPTY_DETAIL;
          const countryName =
            COUNTRIES_LIST.find((country) => country.code === territory)?.name ||
            territory;

          return (
            <article
              key={territory}
              className="rounded-xl border border-[color:var(--lens-sand)]/50 p-4"
            >
              <header className="mb-3">
                <p className="text-sm font-medium text-[color:var(--lens-ink)]">
                  {countryName}
                </p>
                <p className="text-[11px] text-[color:var(--lens-ink)]/50">
                  {territory}
                </p>
              </header>

              <div className="grid gap-3 sm:grid-cols-3">
                <Input
                  label="Release title override"
                  value={detail.title}
                  onChange={(event) =>
                    updateField(territory, "title", event.target.value)
                  }
                  onBlur={() => void persistTerritory(territory)}
                  placeholder="Leave blank to use default"
                />
                <Input
                  label="Display artist override"
                  value={detail.displayArtistName}
                  onChange={(event) =>
                    updateField(
                      territory,
                      "displayArtistName",
                      event.target.value,
                    )
                  }
                  onBlur={() => void persistTerritory(territory)}
                  placeholder="Leave blank to use default"
                />
                <Input
                  label="Label name override"
                  value={detail.labelName}
                  onChange={(event) =>
                    updateField(territory, "labelName", event.target.value)
                  }
                  onBlur={() => void persistTerritory(territory)}
                  placeholder="Leave blank to use default"
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ReleaseTerritoryDetailsSection;
