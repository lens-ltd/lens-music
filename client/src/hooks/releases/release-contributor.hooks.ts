import { useLazyFetchReleaseContributorsQuery } from "@/state/api/apiQuerySlice";
import {
  useCreateReleaseContributorMutation,
  useDeleteReleaseContributorMutation,
} from "@/state/api/apiMutationSlice";

// FETCH RELEASE CONTRIBUTORS
export const useFetchReleaseContributors = () => {
  const [fetchReleaseContributors, { isFetching, data, isSuccess }] =
    useLazyFetchReleaseContributorsQuery();

  return { fetchReleaseContributors, isFetching, data, isSuccess };
};

// CREATE RELEASE CONTRIBUTOR
export const useCreateReleaseContributor = () => {
  const [createReleaseContributor, { isLoading, reset, data, isSuccess, isError, error }] =
    useCreateReleaseContributorMutation();

  return { createReleaseContributor, isLoading, reset, data, isSuccess, isError, error };
};

// DELETE RELEASE CONTRIBUTOR
export const useDeleteReleaseContributor = () => {
  const [deleteReleaseContributor, { isLoading, reset, data, isSuccess, isError, error }] =
    useDeleteReleaseContributorMutation();

  return { deleteReleaseContributor, isLoading, reset, data, isSuccess, isError, error };
};
