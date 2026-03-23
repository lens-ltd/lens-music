import { useEffect } from "react";
import { usePagination } from "@/hooks/common/pagination.hooks";
import { useLazyFetchUsersQuery } from "@/state/api/apiQuerySlice";
import { useAppDispatch } from "@/state/hooks";
import { setUsersList } from "@/state/features/userSlice";

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
