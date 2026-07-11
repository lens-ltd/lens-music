import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import Button from "@/components/inputs/Button";
import {
  useCompleteReleaseNavigationFlow,
  useCreateReleaseNavigationFlow,
} from "@/hooks/releases/navigation.hooks";
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

const ReleaseWizardStores = ({
  currentStepName,
  nextStepName,
  previousStepName,
}: ReleaseWizardStepProps) => {
  const { release } = useAppSelector((state) => state.release);

  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);
  const [storesError, setStoresError] = useState<string | undefined>(undefined);

  const {
    createReleaseNavigationFlow,
    isLoading: createNavigationFlowIsLoading,
  } = useCreateReleaseNavigationFlow();
  const {
    completeReleaseNavigationFlow,
    isLoading: completeNavigationFlowIsLoading,
  } = useCompleteReleaseNavigationFlow();
  const {
    fetchStores,
    data: storesResponse,
    isFetching: storesIsFetching,
  } = useFetchStores();
  const {
    fetchReleaseStores,
    data: releaseStoresResponse,
    isFetching: releaseStoresIsFetching,
  } = useFetchReleaseStores();
  const { assignReleaseStores, isLoading: isAssigning } =
    useAssignReleaseStores();

  useEffect(() => {
    fetchStores({ isActive: true });
  }, [fetchStores]);

  useEffect(() => {
    if (release?.id) {
      fetchReleaseStores({ releaseId: release.id });
    }
  }, [fetchReleaseStores, release?.id]);

  useEffect(() => {
    const assignedStoreIds =
      releaseStoresResponse?.data?.map(
        (releaseStore: { storeId: string }) => releaseStore.storeId,
      ) ?? [];
    setSelectedStoreIds(assignedStoreIds);
    setStoresError(undefined);
  }, [releaseStoresResponse]);

  // When a release has no stores assigned yet, default-select every available
  // store so the "at least one store" rule is satisfied with zero effort. Runs
  // once (guarded), and never overrides a user's manual selection.
  const hasDefaultedStoresRef = useRef(false);
  useEffect(() => {
    if (hasDefaultedStoresRef.current) return;
    if (storesIsFetching || releaseStoresIsFetching) return;
    if (!storesResponse || !releaseStoresResponse) return;

    const assignedStoreIds = releaseStoresResponse?.data ?? [];
    const availableStores = storesResponse?.data ?? [];
    if (assignedStoreIds.length === 0 && availableStores.length > 0) {
      hasDefaultedStoresRef.current = true;
      setSelectedStoreIds(
        availableStores.map((store: { id: string }) => store.id),
      );
    } else if (assignedStoreIds.length > 0) {
      hasDefaultedStoresRef.current = true;
    }
  }, [
    storesIsFetching,
    releaseStoresIsFetching,
    storesResponse,
    releaseStoresResponse,
  ]);

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

    try {
      await assignReleaseStores({
        id: release.id,
        storeIds: selectedStoreIds,
      }).unwrap();

      if (currentStepName) {
        await completeReleaseNavigationFlow({
          staticReleaseNavigationStepName: currentStepName,
          isCompleted: true,
        });
      }
      await createReleaseNavigationFlow({
        releaseId: release.id,
        staticReleaseNavigationStepName: nextStepName,
      });
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to assign stores to this release.";
      toast.error(errorMessage);
    }
  };

  const handleGoBack = () => {
    if (previousStepName && release?.id) {
      createReleaseNavigationFlow({
        releaseId: release.id,
        staticReleaseNavigationStepName: previousStepName,
      });
    }
  };

  const navButtons = (
    <>
      <Button
        type="button"
        isLoading={createNavigationFlowIsLoading}
        disabled={
          createNavigationFlowIsLoading || completeNavigationFlowIsLoading
        }
        onClick={(event) => {
          event.preventDefault();
          handleGoBack();
        }}
      >
        Back
      </Button>
      <Button
        type="button"
        primary
        isLoading={
          isAssigning ||
          createNavigationFlowIsLoading ||
          completeNavigationFlowIsLoading
        }
        disabled={
          selectedStoreIds.length === 0 ||
          isAssigning ||
          createNavigationFlowIsLoading ||
          completeNavigationFlowIsLoading
        }
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
        <h2 className="text-xl font-semibold text-gray-900">Stores</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Select the stores where this release should be delivered.
        </p>
      </header>

      <menu className="flex w-full items-center justify-between gap-3 border-b border-gray-200/70 pb-4">
        {navButtons}
      </menu>

      <section className="flex flex-col gap-3">
        <menu className="grid grid-cols-1 gap-3">
          <label
            htmlFor="select-all-stores"
            className="flex cursor-pointer items-center gap-2 rounded-md border border-[color:var(--lens-sand)]/60 bg-white p-3 shadow-sm transition-colors hover:bg-secondary/5"
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
            <span className="text-xs leading-5 text-[color:var(--lens-ink)]">
              Select all stores
            </span>
          </label>
        </menu>
        <span className="text-[12px] text-[color:var(--lens-ink)]/60">
          {selectedStoreIds.length} of {stores.length} selected
        </span>
        {storesMissingDdex.length > 0 ? (
          <p className="text-[11px] text-amber-700">
            {storesMissingDdex.length} selected store
            {storesMissingDdex.length > 1 ? "s are" : " is"} missing a DDEX
            Party ID. An admin must configure this under `/stores` before
            validation will pass.
          </p>
        ) : null}
      </section>

      <section className="grid grid-cols-1 gap-3 rounded-xl border border-[color:var(--lens-sand)]/70 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {storesIsFetching || releaseStoresIsFetching ? (
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            Loading stores...
          </p>
        ) : stores.length === 0 ? (
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            No stores available.
          </p>
        ) : (
          stores.map((store) => {
            const isSelected = selectedStoreIds.includes(store.id);

            return (
              <label
                key={store.id}
                htmlFor={`store-${store.id}`}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-[color:var(--lens-sand)]/60 bg-white p-3 shadow-sm transition-colors hover:bg-secondary/5"
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
                <span className="text-xs leading-5 text-[color:var(--lens-ink)]">
                  {store.name}
                </span>
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-[10px] ${
                    store.ddexPartyId?.trim()
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
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
        <p className="text-[11px] text-[color:var(--lens-ink)]/50">
          Tip: Use Select all for global distribution, then deselect stores you
          do not want.
        </p>
      )}

      {storesError ? (
        <p className="text-[11px] text-red-600">{storesError}</p>
      ) : null}

      <ReleaseWizardDealsSection />

      <footer className="w-full flex items-center justify-between gap-3">
        {navButtons}
      </footer>
    </section>
  );
};

export default ReleaseWizardStores;
