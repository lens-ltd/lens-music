import {
  useCreateReleaseTerritoryDetailMutation,
  useDeleteReleaseTerritoryDetailMutation,
  useUpdateReleaseTerritoryDetailMutation,
} from "@/state/api/apiMutationSlice";
import { useLazyFetchReleaseTerritoryDetailsQuery } from "@/state/api/apiQuerySlice";

export const useFetchReleaseTerritoryDetails = () => {
  const [fetchReleaseTerritoryDetails, { data, isFetching, isSuccess }] =
    useLazyFetchReleaseTerritoryDetailsQuery();

  return { fetchReleaseTerritoryDetails, data, isFetching, isSuccess };
};

export const useCreateReleaseTerritoryDetail = () => {
  const [createReleaseTerritoryDetail, meta] =
    useCreateReleaseTerritoryDetailMutation();
  return { createReleaseTerritoryDetail, ...meta };
};

export const useUpdateReleaseTerritoryDetail = () => {
  const [updateReleaseTerritoryDetail, meta] =
    useUpdateReleaseTerritoryDetailMutation();
  return { updateReleaseTerritoryDetail, ...meta };
};

export const useDeleteReleaseTerritoryDetail = () => {
  const [deleteReleaseTerritoryDetail, meta] =
    useDeleteReleaseTerritoryDetailMutation();
  return { deleteReleaseTerritoryDetail, ...meta };
};
