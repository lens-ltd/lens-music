import { useLazyFetchContributorMembershipsQuery } from "@/state/api/apiQuerySlice";
import { setContributorMembershipsList } from "@/state/features/contributorMembershipSlice";
import { useAppDispatch } from "@/state/hooks";
import { usePagination } from "../common/pagination.hooks";
import { useEffect } from "react";
import { useDeleteContributorMembershipMutation } from "@/state/api/apiMutationSlice";

// FETCH CONTRIBUTOR MEMBERSHIPS
export const useFetchContributorMemberships = () => {
    const dispatch = useAppDispatch();

    const { page, size, totalCount, totalPages, setPage, setSize, setTotalCount, setTotalPages } = usePagination();

    const [fetchContributorMemberships, { isFetching, data, isSuccess }] = useLazyFetchContributorMembershipsQuery();

    useEffect(() => {
        if (isSuccess) {
            dispatch(setContributorMembershipsList(data?.data?.rows));
            setTotalCount(data?.data?.totalCount);
            setTotalPages(data?.data?.totalPages);
        }
    }, [isSuccess, data, dispatch, setTotalCount, setTotalPages]);

    return { fetchContributorMemberships, isFetching, data, isSuccess, page, size, totalCount, totalPages, setPage, setSize, setTotalCount, setTotalPages };
};

// DELETE CONTRIBUTOR MEMBERSHIP
export const useDeleteContributorMembership = () => {
    const [deleteContributorMembership, { isLoading, data, isSuccess, reset }] = useDeleteContributorMembershipMutation();

    return { deleteContributorMembership, isLoading, data, isSuccess, reset };
};
