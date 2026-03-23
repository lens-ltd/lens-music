import {
  useLazyFetchLyricsQuery,
  useLazyGetLyricsQuery,
} from "@/state/api/apiQuerySlice";
import { setLyrics, setLyricsList } from "@/state/features/lyricSlice";
import { useAppDispatch } from "@/state/hooks";
import { useCallback, useEffect, useState } from "react";
import { usePagination } from "../common/pagination.hooks";
import { useDeleteLyricsMutation } from "@/state/api/apiMutationSlice";

// VALIDATE LYRICS
export const useValidateLyrics = () => {
  // STATE VARIABLES
  const [errors, setErrors] = useState<string[]>([]);

  const MAX_LINE_LENGTH = 70;

  const validateLyrics = useCallback((text: string) => {
    const lines: string[] = text.split("\n");
    const newErrors: string[] = lines.reduce<string[]>((acc, line, index) => {
      if (line.length > MAX_LINE_LENGTH) {
        acc.push(`Line ${index + 1} exceeds ${MAX_LINE_LENGTH} characters`);
      }
      return acc;
    }, []);
    setErrors(newErrors);
  }, []);

  return { errors, validateLyrics };
};

// FETCH LYRICS
export const useFetchLyrics = () => {
  // STATE VARIABLES
  const dispatch = useAppDispatch();

  // PAGINATION
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

  const [fetchLyrics, { data, isFetching, isSuccess }] =
    useLazyFetchLyricsQuery();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setLyricsList(data?.data?.rows));
      setTotalCount(data?.data?.totalCount);
      setTotalPages(data?.data?.totalPages);
    }
  }, [dispatch, data, isSuccess, setTotalCount, setTotalPages]);

  return {
    fetchLyrics,
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

// GET LYRICS
export const useGetLyrics = () => {
  // STATE VARIABLES
  const dispatch = useAppDispatch();

  // INITIALIZE GET LYRICS QUERY
  const [getLyrics, { data, isFetching, isSuccess }] = useLazyGetLyricsQuery();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setLyrics(data?.data));
    }
  }, [dispatch, data, isSuccess]);

  return { getLyrics, data, isFetching, isSuccess };
};

// DELETE LYRICS
export const useDeleteLyrics = () => {

  // INITIALIZE DELETE LYRICS QUERY
  const [deleteLyrics, { data, isLoading, isSuccess, reset }] =
    useDeleteLyricsMutation();

  return { deleteLyrics, isLoading, data, isSuccess, reset };
};
