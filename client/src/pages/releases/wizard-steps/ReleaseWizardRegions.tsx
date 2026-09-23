import Button from "@/components/inputs/Button";
import { BackButton } from "@/components/layout/PageFooter";
import Input from "@/components/inputs/Input";
import { COUNTRIES_LIST } from "@/constants/countries.constants";
import { useWizardStepNavigation } from "@/hooks/releases/wizardStepNavigation.hooks";
import { getApiErrorMessage } from "@/utils/errors.helper";
import { useUpdateReleaseTerritories } from "@/hooks/releases/release.hooks";
import { useAppSelector } from "@/state/hooks";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ReleaseWizardStepProps } from "../ReleaseWizardPage";
import { Input as UiInput } from "@/components/ui/input";
import ReleaseTerritoryDetailsSection from "./components/ReleaseTerritoryDetailsSection";

import { LuSearch } from 'react-icons/lu';

const ALL_COUNTRY_CODES = COUNTRIES_LIST.map((country) => country.code);

const ReleaseWizardRegions = ({
  currentStepName,
  nextStepName,
  previousStepName,
}: ReleaseWizardStepProps) => {
  const { release } = useAppSelector((state) => state.release);
  const { goNext, goBack, isNavigating } = useWizardStepNavigation({
    currentStepName,
    nextStepName,
    previousStepName,
  });
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
    void goBack();
  };

  const handleSaveAndContinue = async () => {
    if (!release?.id) {
      setTerritoriesError("Release is not available yet");
      return;
    }

    setTerritoriesError(undefined);
    resetUpdateReleaseTerritories();
    const releaseId = release.id;

    // Save errors show inline next to the buttons; navigation errors are
    // toasted by `goNext`.
    await goNext(async () => {
      try {
        const response = await updateReleaseTerritories({
          id: releaseId,
          territories: selectedTerritories,
        }).unwrap();
        toast.success(response?.message || "Territories updated successfully");
        return true;
      } catch (error) {
        setTerritoriesError(
          getApiErrorMessage(error, "Failed to update territories"),
        );
        return false;
      }
    });
  };

  const navButtons = (
    <>
      <BackButton
        onClick={handleGoBack}
        disabled={!previousStepName || isNavigating}
      >
        Back
      </BackButton>

      <Button
        type="button"
        primary
        onClick={handleSaveAndContinue}
        isLoading={isNavigating || isSavingTerritories}
      >
        Save & continue
      </Button>
    </>
  );

  return (
    <section className="flex flex-col gap-4 w-full">
      <header className="flex flex-col gap-1">
        <h2 className="text-xl text-(--ink)">Delivery regions</h2>
        <p className="text-sm leading-6 text-(--muted)">
          Leave empty for worldwide availability, or select specific countries
          to restrict delivery.
        </p>
      </header>

      <menu className="flex w-full items-center justify-between gap-3 pb-4">
        {navButtons}
      </menu>

      <Input
        label="Search countries"
        name="release-wizard-regions-country-search"
        placeholder="Filter by country name…"
        prefixIcon={LuSearch}
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
          <p className="col-span-full text-[13px] text-(--muted)">
            No countries match &ldquo;{countrySearchQuery.trim()}&rdquo;.
          </p>
        ) : null}
        {filteredCountries.map((country) => {
          const isSelected = selectedTerritoriesSet.has(country.code);

          return (
            <label
              key={country.code}
              htmlFor={`country-${country.code}`}
              className={`flex items-center gap-2 rounded-(--radius-control) border border-(--line-soft) p-3 cursor-pointer transition-colors hover:bg-(--surface)`}
            >
              <UiInput
                type="checkbox"
                id={`country-${country?.code}`}
                checked={isSelected}
                onChange={() => toggleTerritory(country.code)}
                className="h-4 w-4 cursor-pointer accent-primary"
              />
              <span className="text-xs text-(--ink) leading-5">
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

      <footer className="sticky bottom-0 mt-2 flex flex-col gap-3 bg-(--paper)/95 py-4">
        <p className="text-xs text-(--muted)">
          {selectedTerritories.length === 0
            ? "Worldwide (all countries)"
            : `${selectedTerritories.length} of ${COUNTRIES_LIST.length} countries selected`}
        </p>

        {territoriesError ? (
          <p className="text-xs text-(--ink)">{territoriesError}</p>
        ) : null}

        <menu className="w-full flex items-center justify-between gap-3">
          {navButtons}
        </menu>
      </footer>
    </section>
  );
};

export default ReleaseWizardRegions;
