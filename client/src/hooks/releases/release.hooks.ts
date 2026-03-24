import { useCreateReleaseMutation, useDeleteReleaseMutation, useSubmitReleaseMutation, useUpdateReleaseOverviewMutation, useUpdateReleaseTerritoriesMutation, useUploadReleaseCoverArtMutation, useValidateReleaseMutation } from "@/state/api/apiMutationSlice";
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

// DELETE RELEASE
export const useDeleteRelease = () => {
    const [deleteRelease, { isLoading, reset, data, isSuccess }] = useDeleteReleaseMutation();

    return { deleteRelease, isLoading, reset, data, isSuccess };
};

// UPLOAD RELEASE COVER ART
export const useUploadReleaseCoverArt = () => {
    const dispatch = useAppDispatch();
    const [uploadReleaseCoverArt, { isLoading, reset, data, isSuccess, error }] = useUploadReleaseCoverArtMutation();

    useEffect(() => {
        if (isSuccess && data?.data) {
            dispatch(setRelease(data.data));
        }
    }, [isSuccess, data, dispatch]);

    return { uploadReleaseCoverArt, isLoading, reset, data, isSuccess, error };
};

// UPDATE RELEASE OVERVIEW
export const useUpdateReleaseOverview = () => {
    const dispatch = useAppDispatch();
    const [updateReleaseOverview, { isLoading, reset, data, isSuccess, error }] = useUpdateReleaseOverviewMutation();

    useEffect(() => {
        if (isSuccess && data?.data) {
            dispatch(setRelease(data.data));
        }
    }, [isSuccess, data, dispatch]);

    return { updateReleaseOverview, isLoading, reset, data, isSuccess, error };
};


// UPDATE RELEASE TERRITORIES
export const useUpdateReleaseTerritories = () => {
    const dispatch = useAppDispatch();
    const [updateReleaseTerritories, { isLoading, reset, data, isSuccess, error }] = useUpdateReleaseTerritoriesMutation();

    useEffect(() => {
        if (isSuccess && data?.data) {
            dispatch(setRelease(data.data));
        }
    }, [isSuccess, data, dispatch]);

    return { updateReleaseTerritories, isLoading, reset, data, isSuccess, error };
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
    }, [isSuccess, data, dispatch, setTotalCount, setTotalPages]);

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

// VALIDATE RELEASE
export const useValidateRelease = () => {
    const dispatch = useAppDispatch();
    const [validateRelease, { isLoading, reset, data, isSuccess, isError, error }] =
        useValidateReleaseMutation();

    useEffect(() => {
        if (isSuccess && data?.data?.release) {
            dispatch(setRelease(data.data.release));
        }
    }, [isSuccess, data, dispatch]);

    return { validateRelease, isLoading, reset, data, isSuccess, isError, error };
};

// SUBMIT RELEASE
export const useSubmitRelease = () => {
    const dispatch = useAppDispatch();
    const [submitRelease, { isLoading, reset, data, isSuccess, isError, error }] =
        useSubmitReleaseMutation();

    useEffect(() => {
        if (isSuccess && data?.data?.release) {
            dispatch(setRelease(data.data.release));
        }
    }, [isSuccess, data, dispatch]);

    return { submitRelease, isLoading, reset, data, isSuccess, isError, error };
};
