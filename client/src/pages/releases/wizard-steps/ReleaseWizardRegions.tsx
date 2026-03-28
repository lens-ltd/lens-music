import Button from "@/components/inputs/Button";
import Input from "@/components/inputs/Input";
import { COUNTRIES_LIST } from "@/constants/countries.constants";
import {
  useCompleteReleaseNavigationFlow,
  useCreateReleaseNavigationFlow,
} from "@/hooks/releases/navigation.hooks";
import { useUpdateReleaseTerritories } from "@/hooks/releases/release.hooks";
import { useAppSelector } from "@/state/hooks";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ReleaseWizardStepProps } from "../ReleaseWizardPage";
import { Input as UiInput } from "@/components/ui/input";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import ReleaseTerritoryDetailsSection from "./components/ReleaseTerritoryDetailsSection";

const ALL_COUNTRY_CODES = COUNTRIES_LIST.map((country) => country.code);

const getErrorMessage = (error: unknown) => {
  if (typeof error !== "object" || !error) return "Failed to update territories";

  const errorWithData = error as {
    data?: { message?: string } | string;
    error?: string;
  };

  if (typeof errorWithData.data === "string") return errorWithData.data;
  if (typeof errorWithData.data?.message === "string") {
    return errorWithData.data.message;
  }
  if (typeof errorWithData.error === "string") return errorWithData.error;

  return "Failed to update territories";
};

const ReleaseWizardRegions = ({
  currentStepName,
  nextStepName,
  previousStepName,
}: ReleaseWizardStepProps) => {
  const { release } = useAppSelector((state) => state.release);
  const { createReleaseNavigationFlow, isLoading: createNavigationFlowIsLoading } =
    useCreateReleaseNavigationFlow();
  const { completeReleaseNavigationFlow, isLoading: completeNavigationFlowIsLoading } =
    useCompleteReleaseNavigationFlow();
  const {
    updateReleaseTerritories,
    isLoading: isSavingTerritories,
    reset: resetUpdateReleaseTerritories,
  } = useUpdateReleaseTerritories();
  const [selectedTerritories, setSelectedTerritories] = useState<string[]>([]);
  const [territoriesError, setTerritoriesError] = useState<string | undefined>(undefined);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");

  const filteredCountries = useMemo(() => {
    const q = countrySearchQuery.trim().toLowerCase();
    if (!q) return COUNTRIES_LIST;
    return COUNTRIES_LIST.filter((country) =>
      country.name.toLowerCase().includes(q),
    );
  }, [countrySearchQuery]);

  useEffect(() => {
    const currentTerritories = release?.territories || [];
    const normalizedTerritories = currentTerritories
      .map((territory) => territory.toUpperCase())
      .filter((territory) => ALL_COUNTRY_CODES.includes(territory));

    setSelectedTerritories(normalizedTerritories);
    setTerritoriesError(undefined);
  }, [release?.territories]);

  const selectedTerritoriesSet = useMemo(
    () => new Set(selectedTerritories),
    [selectedTerritories],
  );

  const selectAllCheckedState: CheckedState = useMemo(() => {
    if (selectedTerritories.length === 0) return false;
    if (selectedTerritories.length === COUNTRIES_LIST.length) return true;
    return "indeterminate";
  }, [selectedTerritories]);

  const toggleTerritory = (code: string) => {
    setTerritoriesError(undefined);
    setSelectedTerritories((currentTerritories) => {
      const isSelected = currentTerritories.includes(code);

      if (isSelected) {
        return currentTerritories.filter((territory) => territory !== code);
      }

      return [...currentTerritories, code];
    });
  };

  const handleGoBack = () => {
    if (!release?.id || !previousStepName) return;

    createReleaseNavigationFlow({
      releaseId: release.id,
      staticReleaseNavigationStepName: previousStepName,
    });
  };

  const handleSaveAndContinue = async () => {
    if (!release?.id) {
      setTerritoriesError("Release is not available yet");
      return;
    }

    setTerritoriesError(undefined);
    resetUpdateReleaseTerritories();

    try {
      const response = await updateReleaseTerritories({
        id: release.id,
        territories: selectedTerritories,
      }).unwrap();

      toast.success(response?.message || "Territories updated successfully");

      if (currentStepName) {
        await completeReleaseNavigationFlow({
          staticReleaseNavigationStepName: currentStepName,
          isCompleted: true,
        });
      }
      if (nextStepName) {
        await createReleaseNavigationFlow({
          releaseId: release.id,
          staticReleaseNavigationStepName: nextStepName,
        });
      }
    } catch (error) {
      setTerritoriesError(getErrorMessage(error));
    }
  };

  return (
    <section className="flex flex-col gap-4 w-full">
      <header className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-gray-900">Delivery regions</h2>
        <p className="text-sm leading-6 text-gray-500">
          Leave empty for worldwide availability, or select specific countries
          to restrict delivery.
        </p>
      </header>

      <Input
        label="Search countries"
        name="release-wizard-regions-country-search"
        placeholder="Filter by country name…"
        prefixIcon={faSearch}
        value={countrySearchQuery}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setCountrySearchQuery(e.target.value)
        }
      />

      <section className="flex flex-col gap-2">
        <Input
          label="Select all countries"
          name="release-wizard-regions-select-all-countries"
          type="checkbox"
          className="w-fit cursor-pointer"
          checked={selectAllCheckedState}
          onChange={
            ((state: CheckedState) => {
              setTerritoriesError(undefined);
              if (state === true) {
                setSelectedTerritories(ALL_COUNTRY_CODES);
              } else {
                setSelectedTerritories([]);
              }
            }) as unknown as (e: ChangeEvent<HTMLInputElement>) => void
          }
        />
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {filteredCountries.length === 0 ? (
          <p className="col-span-full text-[12px] text-gray-500">
            No countries match &ldquo;{countrySearchQuery.trim()}&rdquo;.
          </p>
        ) : null}
        {filteredCountries.map((country) => {
          const isSelected = selectedTerritoriesSet.has(country.code);

          return (
            <label
              key={country.code}
              htmlFor={`country-${country.code}`}
              className={`flex items-center gap-2 rounded-md shadow-sm p-3 cursor-pointer transition-colors hover:bg-secondary/5`}
            >
              <UiInput
                type="checkbox"
                id={`country-${country?.code}`}
                checked={isSelected}
                onChange={() => toggleTerritory(country.code)}
                className="h-4 w-4 cursor-pointer accent-primary"
              />
              <span className="text-xs text-[color:var(--lens-ink)] leading-5">
                {country.name}
              </span>
            </label>
          );
        })}
      </section>

      <ReleaseTerritoryDetailsSection
        releaseId={release?.id}
        selectedTerritories={selectedTerritories}
      />

      <footer className="mt-2 flex flex-col gap-3">
        <p className="text-xs text-gray-500">
          {selectedTerritories.length === 0
            ? "Worldwide (all countries)"
            : `${selectedTerritories.length} of ${COUNTRIES_LIST.length} countries selected`}
        </p>

        {territoriesError ? (
          <p className="text-xs text-red-600">{territoriesError}</p>
        ) : null}

        <menu className="w-full flex items-center justify-between gap-3">
          <Button
            type="button"
            onClick={handleGoBack}
            disabled={
              !previousStepName ||
              isSavingTerritories ||
              createNavigationFlowIsLoading ||
              completeNavigationFlowIsLoading
            }
          >
            Back
          </Button>

          <Button
            type="button"
            primary
            onClick={handleSaveAndContinue}
            disabled={
              isSavingTerritories ||
              createNavigationFlowIsLoading ||
              completeNavigationFlowIsLoading
            }
            isLoading={
              isSavingTerritories ||
              createNavigationFlowIsLoading ||
              completeNavigationFlowIsLoading
            }
          >
            Save & continue
          </Button>
        </menu>
      </footer>
    </section>
  );
};

export default ReleaseWizardRegions;
