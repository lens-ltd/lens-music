import { useCreateReleaseMutation } from "@/state/api/apiMutationSlice";
import { useLazyFetchReleasesQuery, useLazyGetReleaseQuery } from "@/state/api/apiQuerySlice";
import { setRelease, setReleasesList } from "@/state/features/releaseSlice";
import { useAppDispatch } from "@/state/hooks";
import { useEffect } from "react";
import { usePagination } from "../common/pagination.hooks";

// CREATE RELEASE
export const useCreateRelease = () => {
    const [createRelease, { isLoading, reset, data, isSuccess }] = useCreateReleaseMutation();

    return { createRelease, isLoading, reset, data, isSuccess };
};

// FETCH RELEASES
export const useFetchReleases = () => {

    const dispatch = useAppDispatch();

    const { page, size, totalCount, totalPages, setPage, setSize, setTotalCount, setTotalPages } = usePagination();

    const [fetchReleases, { isFetching, data, isSuccess }] = useLazyFetchReleasesQuery();

    useEffect(() => {
        if (isSuccess) {
            dispatch(setReleasesList(data?.data?.rows));
            setTotalCount(data?.data?.totalCount);
            setTotalPages(data?.data?.totalPages);
        }
    }, [isSuccess, data, dispatch]);

    return { fetchReleases, isFetching, page, size, totalCount, totalPages, setPage, setSize, setTotalCount, setTotalPages };
};

// GET RELEASE
export const useGetRelease = () => {
    const dispatch = useAppDispatch();

    const [getRelease, { isFetching, data, isSuccess }] = useLazyGetReleaseQuery();

    useEffect(() => {
        if (isSuccess && data?.data) {
            dispatch(setRelease(data.data));
        }
    }, [isSuccess, data, dispatch]);

    return { getRelease, isFetching, data, isSuccess };
};