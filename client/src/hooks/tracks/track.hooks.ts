import {
  useLazyFetchTracksQuery,
  useLazyGetTrackQuery,
} from "@/state/api/apiQuerySlice";
import { usePagination } from "../common/pagination.hooks";
import { useEffect } from "react";
import { setTrack, setTracksList } from "@/state/features/trackSlice";
import { useAppDispatch } from "@/state/hooks";
import { useCreateTrackMutation } from "@/state/api/apiMutationSlice";

// FETCH TRACKS
export const useFetchTracks = () => {
  // STATE
  const dispatch = useAppDispatch();
  const {
    page,
    size,
    totalCount,
    totalPages,
    setPage,
    setSize,
    setTotalCount,
    setTotalPages,
  } = usePagination();

  const [fetchTracks, { isFetching, data, isSuccess }] =
    useLazyFetchTracksQuery();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setTracksList(data?.data?.rows));
      setTotalCount(data?.data?.totalCount);
      setTotalPages(data?.data?.totalPages);
    }
  }, [isSuccess, data, dispatch, setTotalCount, setTotalPages]);

  return {
    fetchTracks,
    isFetching,
    page,
    size,
    totalCount,
    totalPages,
    setPage,
    setSize,
    setTotalCount,
    setTotalPages,
  };
};

// CREATE TRACK
export const useCreateTrack = () => {
  const [createTrack, { isLoading, reset, data, isSuccess, isError, error }] =
    useCreateTrackMutation();

  return { createTrack, isLoading, reset, data, isSuccess, isError, error };
};

// GET TRACK
export const useGetTrack = () => {
  const dispatch = useAppDispatch();
  const [getTrack, { isFetching, data, isSuccess }] = useLazyGetTrackQuery();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setTrack(data?.data));
    }
  }, [isSuccess, data, dispatch]);

  return { getTrack, isFetching, data, isSuccess };
};
