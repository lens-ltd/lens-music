import {
  useCreateReleaseLabelMutation,
  useDeleteReleaseLabelMutation,
  useUpdateReleaseLabelMutation,
} from "@/state/api/apiMutationSlice";
import { useLazyFetchReleaseLabelsQuery } from "@/state/api/apiQuerySlice";

export const useFetchReleaseLabels = () => {
  const [fetchReleaseLabels, { data, isFetching, isSuccess, isError, error }] =
    useLazyFetchReleaseLabelsQuery();

  return { fetchReleaseLabels, data, isFetching, isSuccess, isError, error };
};

export const useCreateReleaseLabel = () => {
  const [createReleaseLabel, meta] = useCreateReleaseLabelMutation();
  return { createReleaseLabel, ...meta };
};

export const useUpdateReleaseLabel = () => {
  const [updateReleaseLabel, meta] = useUpdateReleaseLabelMutation();
  return { updateReleaseLabel, ...meta };
};

export const useDeleteReleaseLabel = () => {
  const [deleteReleaseLabel, meta] = useDeleteReleaseLabelMutation();
  return { deleteReleaseLabel, ...meta };
};
