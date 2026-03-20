import { useLazyFetchTrackContributorsQuery } from "@/state/api/apiQuerySlice";
import {
  useCreateTrackContributorMutation,
  useDeleteTrackContributorMutation,
} from "@/state/api/apiMutationSlice";

// FETCH TRACK CONTRIBUTORS
export const useFetchTrackContributors = () => {
  const [fetchTrackContributors, { isFetching, data, isSuccess }] =
    useLazyFetchTrackContributorsQuery();

  return { fetchTrackContributors, isFetching, data, isSuccess };
};

// CREATE TRACK CONTRIBUTOR
export const useCreateTrackContributor = () => {
  const [createTrackContributor, { isLoading, reset, data, isSuccess, isError, error }] =
    useCreateTrackContributorMutation();

  return { createTrackContributor, isLoading, reset, data, isSuccess, isError, error };
};

// DELETE TRACK CONTRIBUTOR
export const useDeleteTrackContributor = () => {
  const [deleteTrackContributor, { isLoading, reset, data, isSuccess, isError, error }] =
    useDeleteTrackContributorMutation();

  return { deleteTrackContributor, isLoading, reset, data, isSuccess, isError, error };
};
