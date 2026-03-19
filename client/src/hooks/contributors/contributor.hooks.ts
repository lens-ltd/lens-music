import { useLazyFetchContributorsQuery, useLazyGetContributorQuery } from "@/state/api/apiQuerySlice";
import { setContributor, setContributorsList } from "@/state/features/contributorSlice";
import { useAppDispatch } from "@/state/hooks";
import { usePagination } from "../common/pagination.hooks";
import { useEffect } from "react";

// FETCH CONTRIBUTORS
export const useFetchContributors = () => {
    const dispatch = useAppDispatch();

    const { page, size, totalCount, totalPages, setPage, setSize, setTotalCount, setTotalPages } = usePagination();

    const [fetchContributors, { isFetching, data, isSuccess }] = useLazyFetchContributorsQuery();

    useEffect(() => {
        if (isSuccess) {
            dispatch(setContributorsList(data?.data?.rows));
            setTotalCount(data?.data?.totalCount);
            setTotalPages(data?.data?.totalPages);
        }
    }, [isSuccess, data, dispatch]);

    return { fetchContributors, isFetching, page, size, totalCount, totalPages, setPage, setSize, setTotalCount, setTotalPages };
};

// GET CONTRIBUTOR
export const useGetContributor = () => {
    const dispatch = useAppDispatch();

    const [getContributor, { isFetching, data, isSuccess }] = useLazyGetContributorQuery();

    useEffect(() => {
        if (isSuccess && data?.data) {
            dispatch(setContributor(data.data));
        }
    }, [isSuccess, data, dispatch]);

    return { getContributor, isFetching, data, isSuccess };
};