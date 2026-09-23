import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "@/utils/errors.helper";
import { toast } from "sonner";
import Button from "@/components/inputs/Button";
import { BackButton } from "@/components/layout/PageFooter";
import { useWizardStepNavigation } from "@/hooks/releases/wizardStepNavigation.hooks";
import { useFetchStores } from "@/hooks/stores/store.hooks";
import {
  useAssignReleaseStores,
  useFetchReleaseStores,
} from "@/hooks/releases/release-store.hooks";
import { useAppSelector } from "@/state/hooks";
import { Store } from "@/types/models/store.types";
import { Input as UiInput } from "@/components/ui/input";
import { ReleaseWizardStepProps } from "../ReleaseWizardPage";
import ReleaseWizardDealsSection from "./ReleaseWizardDealsSection";
import WizardQueryError from "./components/WizardQueryError";
import { useReleaseSelection } from "@/hooks/releases/releaseSelection.hooks";

const ReleaseWizardStores = ({
  currentStepName,
  nextStepName,
  previousStepName,
}: ReleaseWizardStepProps) => {
  const { release } = useAppSelector((state) => state.release);

  const [storesError, setStoresError] = useState<string | undefined>(undefined);

  const { goNext, goBack, isNavigating } = useWizardStepNavigation({
    currentStepName,
    nextStepName,
    previousStepName,
  });
  const {
    fetchStores,
    data: storesResponse,
    isFetching: storesIsFetching,
    isError: storesIsError,
    error: storesFetchError,
  } = useFetchStores();
  const {
    fetchReleaseStores,
    data: releaseStoresResponse,
    isFetching: releaseStoresIsFetching,
    isError: releaseStoresIsError,
    error: releaseStoresFetchError,
  } = useFetchReleaseStores();
  const { assignReleaseStores, isLoading: isAssigning } =
    useAssignReleaseStores();

  const loadStores = useCallback(() => {
    fetchStores({ isActive: true });
    if (release?.id) {
      fetchReleaseStores({ releaseId: release.id });
    }
  }, [fetchStores, fetchReleaseStores, release?.id]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const storesAreLoaded =
    !storesIsFetching &&
    !releaseStoresIsFetching &&
    Boolean(storesResponse) &&
    Boolean(releaseStoresResponse);

  const assignedStoreIds = useMemo(
    () =>
      storesAreLoaded
        ? (releaseStoresResponse?.data ?? []).map(
            (releaseStore: { storeId: string }) => releaseStore.storeId,
          )
        : undefined,
    [storesAreLoaded, releaseStoresResponse],
  );

  // When a release has no stores assigned yet, every available store starts
  // selected, so the "at least one store" rule is met with zero effort.
  const initialStoreIds = useMemo(
    () =>
      assignedStoreIds?.length === 0
        ? (storesResponse?.data ?? []).map((store: { id: string }) => store.id)
        : undefined,
    [assignedStoreIds, storesResponse],
  );

  const {
    selected: selectedStoreIds,
    setSelected: setSelectedStoreIds,
    markSaved,
  } = useReleaseSelection({
    releaseId: release?.id,
    saved: assignedStoreIds,
    initial: initialStoreIds,
  });

  const storesLoadFailed = storesIsError || releaseStoresIsError;

  const stores: Store[] = useMemo(
    () => storesResponse?.data ?? [],
    [storesResponse],
  );
  const selectedStores = useMemo(
    () => stores.filter((store) => selectedStoreIds.includes(store.id)),
    [selectedStoreIds, stores],
  );
  const storesMissingDdex = useMemo(
    () => selectedStores.filter((store) => !store.ddexPartyId?.trim()),
    [selectedStores],
  );
  const allSelected = useMemo(
    () => stores.length > 0 && selectedStoreIds.length === stores.length,
    [selectedStoreIds.length, stores.length],
  );

  const toggleStoreSelection = (storeId: string, checked: boolean) => {
    setStoresError(undefined);
    setSelectedStoreIds((current) => {
      if (checked) {
        return current.includes(storeId) ? current : [...current, storeId];
      }
      return current.filter((id) => id !== storeId);
    });
  };

  const saveAndContinue = async () => {
    if (!release?.id || !nextStepName) {
      return;
    }

    if (selectedStoreIds.length === 0) {
      setStoresError("Select at least one store before continuing.");
      return;
    }

    const releaseId = release.id;

    await goNext(async () => {
      try {
        await assignReleaseStores({
          id: releaseId,
          storeIds: selectedStoreIds,
        }).unwrap();
        markSaved(selectedStoreIds);
        return true;
      } catch (error) {
        toast.error(
          getApiErrorMessage(error, "Failed to assign stores to this release."),
        );
        return false;
      }
    });
  };

  const handleGoBack = () => {
    void goBack();
  };

  const navButtons = (
    <>
      <BackButton
        disabled={isNavigating}
        onClick={(event) => {
          event.preventDefault();
          handleGoBack();
        }}
      >
        Back
      </BackButton>
      <Button
        type="button"
        primary
        isLoading={isNavigating || isAssigning}
        disabled={selectedStoreIds.length === 0}
        onClick={(event) => {
          event.preventDefault();
          void saveAndContinue();
        }}
      >
        Save and continue
      </Button>
    </>
  );

  return (
    <section className="w-full flex flex-col gap-4">
      <header>
        <h2 className="text-xl text-(--ink)">Stores</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-(--muted)">
          Select the stores where this release should be delivered.
        </p>
      </header>

      <menu className="flex w-full items-center justify-between gap-3 pb-4">
        {navButtons}
      </menu>

      <section className="flex flex-col gap-3">
        <menu className="grid grid-cols-1 gap-3">
          <label
            htmlFor="select-all-stores"
            className="flex cursor-pointer items-center gap-2 rounded-(--radius-control) bg-(--surface) p-3 transition-colors hover:bg-(--surface-hover) has-checked:bg-(--signal-soft)"
          >
            <UiInput
              type="checkbox"
              id="select-all-stores"
              checked={allSelected}
              onChange={(event) => {
                setStoresError(undefined);
                if (event.target.checked) {
                  setSelectedStoreIds(stores.map((store) => store.id));
                } else {
                  setSelectedStoreIds([]);
                }
              }}
              className="h-4 w-4 cursor-pointer accent-primary"
            />
            <span className="text-xs leading-5 text-(--ink)">
              Select all stores
            </span>
          </label>
        </menu>
        <span className="text-[13px] text-(--muted)">
          {selectedStoreIds.length} of {stores.length} selected
        </span>
        {storesMissingDdex.length > 0 ? (
          <p className="text-xs text-(--ink)">
            {storesMissingDdex.length} selected store
            {storesMissingDdex.length > 1 ? "s are" : " is"} missing a DDEX
            Party ID. An admin must configure this under `/stores` before
            validation will pass.
          </p>
        ) : null}
      </section>

      <section className="grid grid-cols-1 gap-3 rounded-(--radius-control) bg-(--surface) p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {storesIsFetching || releaseStoresIsFetching ? (
          <p className="text-[13px] text-(--muted)">
            Loading stores...
          </p>
        ) : storesLoadFailed ? (
          <WizardQueryError
            className="col-span-full"
            title="We couldn't load the stores."
            error={storesFetchError || releaseStoresFetchError}
            onRetry={loadStores}
          />
        ) : stores.length === 0 ? (
          <p className="text-[13px] text-(--muted)">
            No stores available.
          </p>
        ) : (
          stores.map((store) => {
            const isSelected = selectedStoreIds.includes(store.id);

            return (
              <label
                key={store.id}
                htmlFor={`store-${store.id}`}
                className="flex cursor-pointer items-center gap-2 rounded-(--radius-control) bg-(--surface) p-3 transition-colors hover:bg-(--surface-hover) has-checked:bg-(--signal-soft)"
              >
                <UiInput
                  type="checkbox"
                  id={`store-${store.id}`}
                  checked={isSelected}
                  onChange={(event) =>
                    toggleStoreSelection(store.id, event.target.checked)
                  }
                  className="h-4 w-4 cursor-pointer accent-primary"
                />
                <span className="text-xs leading-5 text-(--ink)">
                  {store.name}
                </span>
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-xs ${
                    store.ddexPartyId?.trim()
                      ? "bg-(--success-soft) text-(--success)"
                      : "bg-(--surface) text-(--ink)"
                  }`}
                >
                  {store.ddexPartyId?.trim() ? "DDEX ready" : "Missing DDEX ID"}
                </span>
              </label>
            );
          })
        )}
      </section>

      {!allSelected && stores.length > 0 && (
        <p className="text-xs text-(--muted)">
          Tip: Use Select all for global distribution, then deselect stores you
          do not want.
        </p>
      )}

      {storesError ? (
        <p className="text-xs text-(--ink)">{storesError}</p>
      ) : null}

      <ReleaseWizardDealsSection />

      <footer className="sticky bottom-0 flex w-full items-center justify-between gap-3 bg-(--paper)/95 py-4">
        {navButtons}
      </footer>
    </section>
  );
};

export default ReleaseWizardStores;
