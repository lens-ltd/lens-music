import Button from '@/components/inputs/Button';
import Combobox from '@/components/inputs/Combobox';
import Input from '@/components/inputs/Input';
import {
  useCreateReleaseDeal,
  useDeleteReleaseDeal,
  useFetchReleaseDeals,
} from '@/hooks/releases/release-deals.hooks';
import { useFetchStores } from '@/hooks/stores/store.hooks';
import { useAppSelector } from '@/state/hooks';
import {
  CommercialModelType,
  Deal,
  DealPriceType,
  DealUseType,
} from '@/types/models/deal.types';
import { capitalizeString } from '@/utils/strings.helper';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const commercialModelOptions = Object.values(CommercialModelType).map((v) => ({
  value: v,
  label: capitalizeString(v.replace(/_/g, ' ').toLowerCase()),
}));

const useTypeOptions = Object.values(DealUseType).map((v) => ({
  value: v,
  label: capitalizeString(v.replace(/_/g, ' ').toLowerCase()),
}));

const priceTypeOptions = Object.values(DealPriceType).map((v) => ({
  value: v,
  label: capitalizeString(v.replace(/_/g, ' ').toLowerCase()),
}));

const parseTerritories = (raw: string) =>
  raw
    .split(/[,;\s]+/)
    .map((t) => t.trim().toUpperCase())
    .filter(Boolean);

const ReleaseWizardDealsSection = () => {
  const { release } = useAppSelector((state) => state.release);
  const { fetchReleaseDeals, data, isFetching, isSuccess } =
    useFetchReleaseDeals();
  const { fetchStores, data: storesResponse } = useFetchStores();
  const { createReleaseDeal, isLoading: isCreating } = useCreateReleaseDeal();
  const { deleteReleaseDeal, isLoading: isDeleting } = useDeleteReleaseDeal();

  const [commercialModelType, setCommercialModelType] = useState(
    CommercialModelType.SUBSCRIPTION,
  );
  const [useType, setUseType] = useState(DealUseType.ON_DEMAND_STREAM);
  const [territoriesInput, setTerritoriesInput] = useState('');
  const [startDate, setStartDate] = useState('');
  const [storeId, setStoreId] = useState('');
  const [priceType, setPriceType] = useState<DealPriceType | ''>('');
  const [priceAmount, setPriceAmount] = useState('');
  const [priceCurrency, setPriceCurrency] = useState('');

  useEffect(() => {
    fetchStores({});
  }, [fetchStores]);

  useEffect(() => {
    if (release?.id) {
      fetchReleaseDeals({ releaseId: release.id });
    }
  }, [fetchReleaseDeals, release?.id]);

  useEffect(() => {
    if (release?.digitalReleaseDate && !startDate) {
      setStartDate(release.digitalReleaseDate.slice(0, 10));
    }
  }, [release?.digitalReleaseDate, startDate]);

  const deals: Deal[] = (isSuccess && data?.data) || [];
  const stores = storesResponse?.data ?? [];

  const storeOptions = useMemo(
    () => [
      { value: '', label: 'All stores (global)' },
      ...stores.map((s: { id: string; name: string }) => ({
        value: s.id,
        label: s.name,
      })),
    ],
    [stores],
  );

  const handleCreate = useCallback(async () => {
    if (!release?.id) return;
    const territories = parseTerritories(territoriesInput);
    if (territories.length === 0) {
      toast.error('Enter at least one territory (e.g. US, GB, or WW).');
      return;
    }
    if (!startDate) {
      toast.error('Start date is required.');
      return;
    }
    try {
      await createReleaseDeal({
        releaseId: release.id,
        body: {
          commercialModelType,
          useType,
          territories,
          startDate,
          storeId: storeId || undefined,
          priceType: priceType || undefined,
          priceAmount: priceAmount.trim() || undefined,
          priceCurrency: priceCurrency.trim().toUpperCase() || undefined,
        },
      }).unwrap();
      toast.success('Deal added.');
      await fetchReleaseDeals({ releaseId: release.id });
    } catch (e) {
      const msg =
        (e as { data?: { message?: string } })?.data?.message ||
        'Could not create deal.';
      toast.error(msg);
    }
  }, [
    commercialModelType,
    createReleaseDeal,
    fetchReleaseDeals,
    priceAmount,
    priceCurrency,
    priceType,
    release?.id,
    startDate,
    storeId,
    territoriesInput,
    useType,
  ]);

  const handleDelete = async (dealId: string) => {
    if (!release?.id) return;
    try {
      await deleteReleaseDeal({ releaseId: release.id, dealId }).unwrap();
      toast.success('Deal removed.');
      await fetchReleaseDeals({ releaseId: release.id });
    } catch (e) {
      const msg =
        (e as { data?: { message?: string } })?.data?.message ||
        'Could not delete deal.';
      toast.error(msg);
    }
  };

  return (
    <section className="mt-8 rounded-xl border border-[color:var(--lens-sand)]/70 bg-white p-4 sm:p-5">
      <header className="mb-4 space-y-1">
        <h3 className="text-sm font-medium text-[color:var(--lens-ink)]">
          Commercial deals (DDEX)
        </h3>
        <p className="text-[12px] text-[color:var(--lens-ink)]/55">
          At least one active deal is required before validation. Use a global
          deal (all stores) or add a deal per DSP. Territories: ISO 3166-1
          alpha-2 codes only (list each country), comma-separated.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Combobox
          label="Commercial model"
          options={commercialModelOptions}
          value={commercialModelType}
          onChange={(v) => setCommercialModelType(v as CommercialModelType)}
        />
        <Combobox
          label="Use type"
          options={useTypeOptions}
          value={useType}
          onChange={(v) => setUseType(v as DealUseType)}
        />
        <Combobox
          label="Store scope"
          options={storeOptions}
          value={storeId}
          onChange={(v) => setStoreId(v)}
        />
        <Input
          label="Territories"
          value={territoriesInput}
          onChange={(e) => setTerritoriesInput(e.target.value)}
          placeholder="e.g. US, CA, GB (ISO 3166-1 alpha-2)"
        />
        <Input
          label="Start date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Combobox
          label="Price type (optional)"
          options={[
            { value: '', label: 'None' },
            ...priceTypeOptions,
          ]}
          value={priceType}
          onChange={(v) => setPriceType((v as DealPriceType) || '')}
        />
        <Input
          label="Price amount (optional)"
          value={priceAmount}
          onChange={(e) => setPriceAmount(e.target.value)}
        />
        <Input
          label="Currency (ISO 4217, optional)"
          value={priceCurrency}
          onChange={(e) =>
            setPriceCurrency(e.target.value.slice(0, 3).toUpperCase())
          }
          placeholder="USD"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Button primary onClick={() => void handleCreate()} isLoading={isCreating}>
          Add deal
        </Button>
      </div>

      <div className="mt-6 border-t border-[color:var(--lens-sand)]/50 pt-4">
        <h4 className="text-[12px] font-medium text-[color:var(--lens-ink)]">
          Active deals
        </h4>
        {isFetching ? (
          <p className="mt-2 text-[12px] text-[color:var(--lens-ink)]/55">
            Loading…
          </p>
        ) : deals.length === 0 ? (
          <p className="mt-2 text-[12px] text-[color:var(--lens-ink)]/55">
            No deals yet. Add one above.
          </p>
        ) : (
          <ul className="mt-2 flex list-none flex-col gap-2 p-0">
            {deals.map((deal) => (
              <li
                key={deal.id}
                className="flex items-start justify-between gap-3 rounded-md border border-[color:var(--lens-sand)]/40 p-3 text-[12px]"
              >
                <div className="space-y-0.5">
                  <p className="font-medium text-[color:var(--lens-ink)]">
                    {deal.commercialModelType} · {deal.useType}
                  </p>
                  <p className="text-[11px] text-[color:var(--lens-ink)]/55">
                    {deal.territories.join(', ')}
                    {deal.store?.name
                      ? ` · Store: ${deal.store.name}`
                      : ' · All stores'}
                  </p>
                  <p className="text-[11px] text-[color:var(--lens-ink)]/55">
                    {deal.startDate}
                    {deal.isActive === false ? ' · inactive' : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDelete(deal.id)}
                  disabled={isDeleting}
                  className="shrink-0 text-[11px] text-red-700 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ReleaseWizardDealsSection;
