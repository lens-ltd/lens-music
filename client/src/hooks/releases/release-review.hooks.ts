import {
  useApproveReleaseMutation,
  useRejectReleaseMutation,
} from "@/state/api/apiMutationSlice";
import { useLazyFetchReleaseReviewQueueQuery } from "@/state/api/apiQuerySlice";
import { setReleasesList } from "@/state/features/releaseSlice";
import { useAppDispatch } from "@/state/hooks";
import { useEffect } from "react";
import { usePagination } from "../common/pagination.hooks";

// FETCH RELEASE REVIEW QUEUE
export const useFetchReleaseReviewQueue = () => {
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

  const [fetchReleaseReviewQueue, { isFetching, data, isSuccess }] =
    useLazyFetchReleaseReviewQueueQuery();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setReleasesList(data?.data?.rows ?? []));
      setTotalCount(data?.data?.totalCount);
      setTotalPages(data?.data?.totalPages);
    }
  }, [isSuccess, data, dispatch, setTotalCount, setTotalPages]);

  return {
    fetchReleaseReviewQueue,
    isFetching,
    data,
    isSuccess,
    page,
    size,
    totalCount,
    totalPages,
    setPage,
    setSize,
  };
};

// APPROVE RELEASE
export const useApproveRelease = () => {
  const [approveRelease, { isLoading, data, isSuccess, reset }] =
    useApproveReleaseMutation();

  return { approveRelease, isLoading, data, isSuccess, reset };
};

// REJECT RELEASE
export const useRejectRelease = () => {
  const [rejectRelease, { isLoading, data, isSuccess, reset }] =
    useRejectReleaseMutation();

  return { rejectRelease, isLoading, data, isSuccess, reset };
};
