import { useLazyFetchStoresQuery } from '@/state/api/apiQuerySlice';

export const useFetchStores = () => {
  const [fetchStores, { data, isFetching, isSuccess }] =
    useLazyFetchStoresQuery();

  return { fetchStores, data, isFetching, isSuccess };
};
