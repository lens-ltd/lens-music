import { useLazyFetchLabelsQuery } from '@/state/api/apiQuerySlice';
import {
  setLabelsList,
  setLabelTotalCount,
  setLabelTotalPages,
} from '@/state/features/labelSlice';
import { AppDispatch, RootState } from '@/state/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

interface UseFetchLabelsProps {
  isOpen?: boolean;
  size?: number;
}

export const useFetchLabels = ({ isOpen, size }: UseFetchLabelsProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { labelsList, page, size: labelsSize, totalCount, totalPages } = useSelector(
    (state: RootState) => state.label
  );

  // INITIALIZE FETCH LABELS QUERY
  const [
    fetchLabels,
    {
      data: labelsData,
      error: labelsError,
      isFetching: labelsIsFetching,
      isSuccess: labelsIsSuccess,
      isError: labelsIsError,
    },
  ] = useLazyFetchLabelsQuery();

  // FETCH LABELS
  useEffect(() => {
    if (isOpen) {
      fetchLabels({ size: size || labelsSize, page });
    }
  }, [fetchLabels, page, size, isOpen, labelsSize]);

  // HANDLE FETCH LABELS RESPONSE
  useEffect(() => {
    if (labelsIsError) {
      const errorResponse =
        (labelsError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching labels';
      toast.error(errorResponse);
    }
    if (labelsIsSuccess) {
      dispatch(setLabelsList(labelsData?.data?.rows));
      dispatch(setLabelTotalCount(labelsData?.data?.totalCount));
      dispatch(setLabelTotalPages(labelsData?.data?.totalPages));
    }
  }, [labelsIsError, labelsIsSuccess, labelsError, labelsData, dispatch]);

  return {
    labelsList,
    page,
    size,
    totalCount,
    totalPages,
    labelsIsFetching,
    labelsIsSuccess,
    labelsIsError,
  };
};
