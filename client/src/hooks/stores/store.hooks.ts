import { useLazyFetchStoresQuery } from '@/state/api/apiQuerySlice';
import { useUpdateStoreMutation } from '@/state/api/apiMutationSlice';

export const useFetchStores = () => {
  const [fetchStores, { data, isFetching, isSuccess }] =
    useLazyFetchStoresQuery();

  return { fetchStores, data, isFetching, isSuccess };
};

export const useUpdateStore = () => {
  const [updateStore, meta] = useUpdateStoreMutation();

  return { updateStore, ...meta };
};
