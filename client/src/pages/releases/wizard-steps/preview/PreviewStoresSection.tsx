import { useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardSection from '@/pages/dashboard/components/DashboardSection';
import { useFetchReleaseStores } from '@/hooks/releases/release-store.hooks';
import { ReleaseStore } from '@/types/models/releaseStore.types';

interface PreviewStoresSectionProps {
  releaseId: string;
}

const PreviewStoresSection = ({ releaseId }: PreviewStoresSectionProps) => {
  const { fetchReleaseStores, data, isFetching } = useFetchReleaseStores();

  useEffect(() => {
    if (releaseId) {
      fetchReleaseStores({ releaseId });
    }
  }, [fetchReleaseStores, releaseId]);

  const releaseStores: ReleaseStore[] = data?.data ?? [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.35, ease: 'easeOut' }}
    >
      <DashboardSection title="Stores" label="Distribution">
        {isFetching ? (
          <p className="text-[12px] text-(--slate)">Loading stores...</p>
        ) : releaseStores.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {releaseStores.map((releaseStore) => (
              <li
                key={releaseStore.id}
                className="rounded-full border border-(--line) bg-(--surface) px-2.5 py-0.5 text-[11px] text-(--ink)/70"
              >
                {releaseStore.store?.name || 'Unknown store'} ·{' '}
                {releaseStore.store?.ddexPartyId?.trim() ? 'DDEX ready' : 'Missing DDEX ID'}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[12px] text-(--slate)">
            No stores selected yet.
          </p>
        )}
      </DashboardSection>
    </motion.article>
  );
};

export default PreviewStoresSection;
