import {
  useLazyFetchContributorsQuery,
  useLazyFetchContributorManagersQuery,
  useLazyGetContributorQuery,
} from "@/state/api/apiQuerySlice";
import {
  setContributor,
  setContributorsList,
  setManagersList,
} from "@/state/features/contributorSlice";
import { useAppDispatch } from "@/state/hooks";
import { usePagination } from "../common/pagination.hooks";
import { useEffect } from "react";
import {
  useDeleteContributorMutation,
  useVerifyContributorMutation,
  useRejectContributorMutation,
  useAssignContributorManagerMutation,
  useUnassignContributorManagerMutation,
} from "@/state/api/apiMutationSlice";

// FETCH CONTRIBUTORS
export const useFetchContributors = () => {
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

  const [fetchContributors, { isFetching, data, isSuccess }] =
    useLazyFetchContributorsQuery();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setContributorsList(data?.data?.rows));
      setTotalCount(data?.data?.totalCount);
      setTotalPages(data?.data?.totalPages);
    }
  }, [isSuccess, data, dispatch, setTotalCount, setTotalPages]);

  return {
    fetchContributors,
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

// GET CONTRIBUTOR
export const useGetContributor = () => {
  const dispatch = useAppDispatch();

  const [getContributor, { isFetching, data, isSuccess }] =
    useLazyGetContributorQuery();

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setContributor(data.data));
    }
  }, [isSuccess, data, dispatch]);

  return { getContributor, isFetching, data, isSuccess };
};

// DELETE CONTRIBUTOR
export const useDeleteContributor = () => {
  const [deleteContributor, { isLoading, data, isSuccess, reset }] =
    useDeleteContributorMutation();

  return { deleteContributor, isLoading, data, isSuccess, reset };
};

// VERIFY CONTRIBUTOR
export const useVerifyContributor = () => {
  const [verifyContributor, { isLoading, data, isSuccess, reset }] =
    useVerifyContributorMutation();

  return { verifyContributor, isLoading, data, isSuccess, reset };
};

// REJECT CONTRIBUTOR
export const useRejectContributor = () => {
  const [rejectContributor, { isLoading, data, isSuccess, reset }] =
    useRejectContributorMutation();

  return { rejectContributor, isLoading, data, isSuccess, reset };
};

// FETCH CONTRIBUTOR MANAGERS
export const useFetchContributorManagers = () => {
  const dispatch = useAppDispatch();
  const [fetchManagers, { isFetching, data, isSuccess, isError, error }] =
    useLazyFetchContributorManagersQuery();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setManagersList(data?.data ?? []));
    }
  }, [isSuccess, data, dispatch]);

  return {
    fetchManagers,
    isFetching,
    isSuccess,
    isError,
    error,
    data: data?.data,
  };
};

// ASSIGN CONTRIBUTOR MANAGER
export const useAssignContributorManager = () => {
  const [assignManager, { isLoading, data, isSuccess, isError, error, reset }] =
    useAssignContributorManagerMutation();

  return { assignManager, isLoading, data, isSuccess, isError, error, reset };
};

// UNASSIGN CONTRIBUTOR MANAGER
export const useUnassignContributorManager = () => {
  const [
    unassignManager,
    { isLoading, data, isSuccess, isError, error, reset },
  ] = useUnassignContributorManagerMutation();

  return { unassignManager, isLoading, data, isSuccess, isError, error, reset };
};
