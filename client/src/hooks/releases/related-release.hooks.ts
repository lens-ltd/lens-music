import {
  useCreateRelatedReleaseMutation,
  useDeleteRelatedReleaseMutation,
  useUpdateRelatedReleaseMutation,
} from "@/state/api/apiMutationSlice";
import { useLazyFetchRelatedReleasesQuery } from "@/state/api/apiQuerySlice";

export const useFetchRelatedReleases = () => {
  const [fetchRelatedReleases, { data, isFetching, isSuccess }] =
    useLazyFetchRelatedReleasesQuery();

  return { fetchRelatedReleases, data, isFetching, isSuccess };
};

export const useCreateRelatedRelease = () => {
  const [createRelatedRelease, meta] = useCreateRelatedReleaseMutation();
  return { createRelatedRelease, ...meta };
};

export const useUpdateRelatedRelease = () => {
  const [updateRelatedRelease, meta] = useUpdateRelatedReleaseMutation();
  return { updateRelatedRelease, ...meta };
};

export const useDeleteRelatedRelease = () => {
  const [deleteRelatedRelease, meta] = useDeleteRelatedReleaseMutation();
  return { deleteRelatedRelease, ...meta };
};
