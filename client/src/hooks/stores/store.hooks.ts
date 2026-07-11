import {
  useLazyFetchStoresQuery,
  useLazyGetStoreQuery,
} from '@/state/api/apiQuerySlice';
import { useUpdateStoreMutation } from '@/state/api/apiMutationSlice';
import { useCallback } from 'react';

export const useFetchStores = () => {
  const [trigger, { data, isFetching, isSuccess, isError, error }] =
    useLazyFetchStoresQuery();

  const fetchStores = useCallback(
    (params?: { isActive?: boolean }) => trigger(params ?? {}),
    [trigger],
  );

  return { fetchStores, data, isFetching, isSuccess, isError, error };
};

export const useGetStore = () => {
  const [getStore, { data, isFetching, isSuccess, isError, error, isUninitialized }] =
    useLazyGetStoreQuery();

  return {
    getStore,
    data: data?.data,
    raw: data,
    isFetching,
    isSuccess,
    isError,
    error,
    isUninitialized,
  };
};

export const useUpdateStore = () => {
  const [updateStore, meta] = useUpdateStoreMutation();

  return { updateStore, ...meta };
};
