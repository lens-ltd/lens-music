import { useEffect } from "react";
import { usePagination } from "@/hooks/common/pagination.hooks";
import { useLazyFetchRolesQuery, useLazyFetchRoleByIdQuery } from "@/state/api/apiQuerySlice";
import { useAppDispatch } from "@/state/hooks";
import { setRolesList, setRole } from "@/state/features/roleSlice";

export const useFetchRoles = () => {
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

  const [fetchRoles, { data, isFetching, isError, error, isSuccess }] =
    useLazyFetchRolesQuery();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setRolesList(data?.data?.rows));
      setTotalCount(data?.data?.totalCount);
      setTotalPages(data?.data?.totalPages);
    }
  }, [isSuccess, data, dispatch, setTotalCount, setTotalPages]);

  return {
    fetchRoles,
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

export const useFetchRoleById = () => {
  const dispatch = useAppDispatch();
  const [fetchRoleById, { data, isFetching, isError, error, isSuccess }] =
    useLazyFetchRoleByIdQuery();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setRole(data?.data));
    }
  }, [isSuccess, data, dispatch]);

  return {
    fetchRoleById,
    isFetching,
    isError,
    error,
    isSuccess,
    data: data?.data,
  };
};