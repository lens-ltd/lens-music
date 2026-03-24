import {
  useAssignReleaseStoresMutation,
  useDeleteReleaseStoreMutation,
} from '@/state/api/apiMutationSlice';
import { useLazyFetchReleaseStoresQuery } from '@/state/api/apiQuerySlice';

export const useFetchReleaseStores = () => {
  const [fetchReleaseStores, { data, isFetching, isSuccess }] =
    useLazyFetchReleaseStoresQuery();

  return { fetchReleaseStores, data, isFetching, isSuccess };
};

export const useAssignReleaseStores = () => {
  const [assignReleaseStores, { data, isLoading, isSuccess, isError, error, reset }] =
    useAssignReleaseStoresMutation();

  return { assignReleaseStores, data, isLoading, isSuccess, isError, error, reset };
};

export const useDeleteReleaseStore = () => {
  const [deleteReleaseStore, { data, isLoading, isSuccess, isError, error, reset }] =
    useDeleteReleaseStoreMutation();

  return { deleteReleaseStore, data, isLoading, isSuccess, isError, error, reset };
};
