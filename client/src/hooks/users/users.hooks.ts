import { useCallback, useEffect } from "react";
import { usePagination } from "@/hooks/common/pagination.hooks";
import {
  useLazyFetchUserByIdQuery,
  useLazyFetchUsersQuery,
} from "@/state/api/apiQuerySlice";
import { useAppDispatch } from "@/state/hooks";
import { setUser, setUsersList } from "@/state/features/userSlice";

export const useFetchUsers = () => {
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

  const [fetchUsers, { data, isFetching, isError, error, isSuccess }] =
    useLazyFetchUsersQuery();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUsersList(data?.data?.rows));
      setTotalCount(data?.data?.totalCount);
      setTotalPages(data?.data?.totalPages);
    }
  }, [isSuccess, data, dispatch, setTotalCount, setTotalPages]);

  return {
    fetchUsers,
    isFetching,
    page,
    size,
    totalCount,
    totalPages,
    setPage,
    setSize,
    isError,
    error,
  };
};

export const useFetchUserById = () => {
  const dispatch = useAppDispatch();
  const [trigger, { data, isFetching, isError, error, isSuccess, isUninitialized }] =
    useLazyFetchUserByIdQuery();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUser(data?.data));
    }
  }, [isSuccess, data, dispatch]);

  const fetchUserById = useCallback(
    (args: { id: string }) => {
      // Avoid flashing a previous user's details while a new id loads.
      dispatch(setUser(undefined));
      return trigger(args);
    },
    [dispatch, trigger],
  );

  return {
    fetchUserById,
    isFetching,
    isError,
    error,
    isSuccess,
    isUninitialized,
    data: data?.data,
  };
};
