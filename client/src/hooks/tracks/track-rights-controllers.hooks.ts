import {
  useCreateTrackRightsControllerMutation,
  useDeleteTrackRightsControllerMutation,
  useUpdateTrackRightsControllerMutation,
} from '@/state/api/apiMutationSlice';
import { useLazyFetchTrackRightsControllersQuery } from '@/state/api/apiQuerySlice';

export const useFetchTrackRightsControllers = () => {
  const [fetchTrackRightsControllers, { data, isFetching, isSuccess }] =
    useLazyFetchTrackRightsControllersQuery();

  return { fetchTrackRightsControllers, data, isFetching, isSuccess };
};

export const useCreateTrackRightsController = () => {
  const [createTrackRightsController, meta] =
    useCreateTrackRightsControllerMutation();
  return { createTrackRightsController, ...meta };
};

export const useUpdateTrackRightsController = () => {
  const [updateTrackRightsController, meta] =
    useUpdateTrackRightsControllerMutation();
  return { updateTrackRightsController, ...meta };
};

export const useDeleteTrackRightsController = () => {
  const [deleteTrackRightsController, meta] =
    useDeleteTrackRightsControllerMutation();
  return { deleteTrackRightsController, ...meta };
};
