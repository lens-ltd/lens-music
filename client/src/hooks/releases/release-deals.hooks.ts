import {
  useCreateReleaseDealMutation,
  useDeleteReleaseDealMutation,
  useUpdateReleaseDealMutation,
} from '@/state/api/apiMutationSlice';
import { useLazyFetchReleaseDealsQuery } from '@/state/api/apiQuerySlice';

export const useFetchReleaseDeals = () => {
  const [fetchReleaseDeals, { data, isFetching, isSuccess, isError, error }] =
    useLazyFetchReleaseDealsQuery();

  return { fetchReleaseDeals, data, isFetching, isSuccess, isError, error };
};

export const useCreateReleaseDeal = () => {
  const [createReleaseDeal, meta] = useCreateReleaseDealMutation();
  return { createReleaseDeal, ...meta };
};

export const useUpdateReleaseDeal = () => {
  const [updateReleaseDeal, meta] = useUpdateReleaseDealMutation();
  return { updateReleaseDeal, ...meta };
};

export const useDeleteReleaseDeal = () => {
  const [deleteReleaseDeal, meta] = useDeleteReleaseDealMutation();
  return { deleteReleaseDeal, ...meta };
};
