import { useMemo } from "react";
import Combobox from "@/components/inputs/Combobox";
import Input from "@/components/inputs/Input";
import SectionCard from "@/components/layout/SectionCard";
import { COUNTRIES_LIST } from "@/constants/countries.constants";
import { iconButtonDangerClassName } from "@/constants/input.constants";
import { useReleaseTerritoryOverrides } from "@/hooks/releases/territoryOverrides.hooks";
import {
  EMPTY_TERRITORY_DETAIL,
  isTerritoryInScope,
} from "@/utils/territoryDetails.helper";
import WizardQueryError from "./WizardQueryError";

import { LuTrash2 } from "react-icons/lu";

const getCountryName = (code: string) =>
  COUNTRIES_LIST.find((country) => country.code === code)?.name || code;

// Only countries with an override are listed; the artist adds one through the
// country picker. Removals are listed until the step is saved.
const ReleaseTerritoryDetailsSection = ({
  selectedTerritories,
  overrides,
}: {
  selectedTerritories: string[];
  overrides: ReturnType<typeof useReleaseTerritoryOverrides>;
}) => {
  const {
    forms,
    overrideTerritories,
    pendingRemovals,
    isFetching,
    isError,
    error,
    refetch,
    addOverride,
    removeOverride,
    updateField,
    persistOverride,
  } = overrides;

  const countryOptions = useMemo(
    () =>
      COUNTRIES_LIST.filter(
        (country) =>
          isTerritoryInScope(country.code, selectedTerritories) &&
          !overrideTerritories.includes(country.code),
      ).map((country) => ({ label: country.name, value: country.code })),
    [overrideTerritories, selectedTerritories],
  );

  return (
    <SectionCard
      title="Territory-specific metadata"
      description="Add an override only where the title, display artist or label name must differ in a country. Changes save when a field loses focus."
    >
      <div className="flex flex-col gap-4">
        {isError ? (
          <WizardQueryError
            title="We couldn't load your territory overrides."
            error={error}
            onRetry={refetch}
            isRetrying={isFetching}
          />
        ) : isFetching && overrideTerritories.length === 0 ? (
          <p className="type-meta">Loading overrides…</p>
        ) : overrideTerritories.length === 0 ? (
          <p className="type-meta">No overrides yet.</p>
        ) : (
          <ul className="m-0 grid list-none gap-3 p-0">
            {overrideTerritories.map((territory) => {
              const detail = forms[territory] || EMPTY_TERRITORY_DETAIL;
              const countryName = getCountryName(territory);

              return (
                <li
                  key={territory}
                  className="rounded-(--radius-control) bg-(--surface) p-4"
                >
                  <header className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="type-body text-(--ink)">{countryName}</p>
                      <p className="type-meta">{territory}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove override for ${countryName}`}
                      className={iconButtonDangerClassName}
                      onClick={() => removeOverride(territory)}
                    >
                      <LuTrash2 className="size-4" aria-hidden="true" />
                    </button>
                  </header>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <Input
                      label="Release title override"
                      value={detail.title}
                      onChange={(event) =>
                        updateField(territory, "title", event.target.value)
                      }
                      onBlur={() => void persistOverride(territory)}
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
                      onBlur={() => void persistOverride(territory)}
                      placeholder="Leave blank to use default"
                    />
                    <Input
                      label="Label name override"
                      value={detail.labelName}
                      onChange={(event) =>
                        updateField(territory, "labelName", event.target.value)
                      }
                      onBlur={() => void persistOverride(territory)}
                      placeholder="Leave blank to use default"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {pendingRemovals.length > 0 ? (
          <p className="type-meta" role="status">
            {pendingRemovals.length === 1 ? "The override" : "Overrides"} for{" "}
            {pendingRemovals
              .map(({ territory }) => getCountryName(territory))
              .join(", ")}{" "}
            will be removed when you save.
          </p>
        ) : null}

        <div className="sm:max-w-sm">
          <Combobox
            label="Add override for a country"
            placeholder="Choose a country"
            options={countryOptions}
            value=""
            onChange={(code) => {
              if (code) addOverride(code);
            }}
          />
        </div>
      </div>
    </SectionCard>
  );
};

export default ReleaseTerritoryDetailsSection;
