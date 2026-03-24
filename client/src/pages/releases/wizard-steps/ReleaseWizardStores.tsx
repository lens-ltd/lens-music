import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import { useCreateReleaseNavigationFlow } from '@/hooks/releases/navigation.hooks';
import { useFetchStores } from '@/hooks/stores/store.hooks';
import {
  useAssignReleaseStores,
  useFetchReleaseStores,
} from '@/hooks/releases/release-store.hooks';
import { useAppSelector } from '@/state/hooks';
import { Store } from '@/types/models/store.types';
import { ReleaseWizardStepProps } from '../ReleaseWizardPage';

const ReleaseWizardStores = ({
  nextStepName,
  previousStepName,
}: ReleaseWizardStepProps) => {
  const { release } = useAppSelector((state) => state.release);

  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);

  const { createReleaseNavigationFlow, isLoading: isNavigating } =
    useCreateReleaseNavigationFlow();
  const { fetchStores, data: storesResponse, isFetching: storesIsFetching } =
    useFetchStores();
  const {
    fetchReleaseStores,
    data: releaseStoresResponse,
    isFetching: releaseStoresIsFetching,
  } = useFetchReleaseStores();
  const { assignReleaseStores, isLoading: isAssigning } = useAssignReleaseStores();

  useEffect(() => {
    fetchStores({});
  }, [fetchStores]);

  useEffect(() => {
    if (release?.id) {
      fetchReleaseStores({ releaseId: release.id });
    }
  }, [fetchReleaseStores, release?.id]);

  useEffect(() => {
    const assignedStoreIds =
      releaseStoresResponse?.data?.map((releaseStore: { storeId: string }) => releaseStore.storeId) ?? [];
    setSelectedStoreIds(assignedStoreIds);
  }, [releaseStoresResponse]);

  const stores: Store[] = storesResponse?.data ?? [];

  const allSelected = useMemo(
    () => stores.length > 0 && selectedStoreIds.length === stores.length,
    [selectedStoreIds.length, stores.length],
  );

  const toggleStoreSelection = (storeId: string, checked: boolean) => {
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

    try {
      await assignReleaseStores({
        id: release.id,
        storeIds: selectedStoreIds,
      }).unwrap();

      createReleaseNavigationFlow({
        releaseId: release.id,
        staticReleaseNavigationStepName: nextStepName,
      });
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        'Failed to assign stores to this release.';
      toast.error(errorMessage);
    }
  };

  return (
    <section className="w-full flex flex-col gap-4">
      <header>
        <h2 className="text-xl font-semibold text-gray-900">Stores</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Select the stores where this release should be delivered.
        </p>
      </header>

      <section className="flex flex-wrap items-center gap-2">
        <Button
          onClick={(event) => {
            event.preventDefault();
            setSelectedStoreIds(stores.map((store) => store.id));
          }}
        >
          Select all
        </Button>
        <Button
          onClick={(event) => {
            event.preventDefault();
            setSelectedStoreIds([]);
          }}
        >
          Deselect all
        </Button>
        <span className="text-[12px] text-[color:var(--lens-ink)]/60">
          {selectedStoreIds.length} of {stores.length} selected
        </span>
      </section>

      <section className="grid grid-cols-1 gap-3 rounded-xl border border-[color:var(--lens-sand)]/70 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {storesIsFetching || releaseStoresIsFetching ? (
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">Loading stores...</p>
        ) : stores.length === 0 ? (
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">No stores available.</p>
        ) : (
          stores.map((store) => (
            <article
              key={store.id}
              className="rounded-lg border border-[color:var(--lens-sand)]/60 bg-white px-3 py-2"
            >
              <Input
                type="checkbox"
                label={store.name}
                checked={selectedStoreIds.includes(store.id)}
                onChange={(checked) => toggleStoreSelection(store.id, Boolean(checked))}
              />
            </article>
          ))
        )}
      </section>

      {!allSelected && stores.length > 0 && (
        <p className="text-[11px] text-[color:var(--lens-ink)]/50">
          Tip: Use Select all for global distribution, then deselect stores you do not want.
        </p>
      )}

      <footer className="w-full flex items-center justify-between gap-3">
        <Button
          isLoading={isNavigating}
          onClick={(event) => {
            event.preventDefault();
            if (previousStepName && release?.id) {
              createReleaseNavigationFlow({
                releaseId: release.id,
                staticReleaseNavigationStepName: previousStepName,
              });
            }
          }}
        >
          Back
        </Button>
        <Button
          isLoading={isAssigning || isNavigating}
          primary
          onClick={(event) => {
            event.preventDefault();
            void saveAndContinue();
          }}
        >
          Save and continue
        </Button>
      </footer>
    </section>
  );
};

export default ReleaseWizardStores;
