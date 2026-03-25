import { UUID } from '../types/common.types';

export type DealLike = {
  storeId?: UUID | null;
};

/**
 * A release store is covered if there is a global deal (storeId null) or a deal targeting that store.
 */
export const releaseStoreHasDealCoverage = (
  storeId: UUID,
  deals: DealLike[],
): boolean => {
  return (
    deals.some((d) => !d.storeId) || deals.some((d) => d.storeId === storeId)
  );
};
