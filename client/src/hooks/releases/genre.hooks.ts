import { useLazyFetchGenresQuery, useLazyFetchReleaseGenresQuery } from '@/state/api/apiQuerySlice';
import {
  useCreateGenreMutation,
  useDeleteReleaseGenreMutation,
  useUpsertReleaseGenreMutation,
} from '@/state/api/apiMutationSlice';

export const useFetchGenres = () => {
  const [fetchGenres, { isFetching, data, isSuccess }] = useLazyFetchGenresQuery();
  return { fetchGenres, isFetching, data, isSuccess };
};

export const useCreateGenre = () => {
  const [createGenre, { isLoading, data, isSuccess, isError, error, reset }] =
    useCreateGenreMutation();
  return { createGenre, isLoading, data, isSuccess, isError, error, reset };
};

export const useFetchReleaseGenres = () => {
  const [fetchReleaseGenres, { isFetching, data, isSuccess }] =
    useLazyFetchReleaseGenresQuery();
  return { fetchReleaseGenres, isFetching, data, isSuccess };
};

export const useUpsertReleaseGenre = () => {
  const [upsertReleaseGenre, { isLoading, data, isSuccess, isError, error, reset }] =
    useUpsertReleaseGenreMutation();
  return { upsertReleaseGenre, isLoading, data, isSuccess, isError, error, reset };
};

export const useDeleteReleaseGenre = () => {
  const [deleteReleaseGenre, { isLoading, data, isSuccess, isError, error, reset }] =
    useDeleteReleaseGenreMutation();
  return { deleteReleaseGenre, isLoading, data, isSuccess, isError, error, reset };
};
