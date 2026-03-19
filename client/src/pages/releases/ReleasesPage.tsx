import Table from '@/components/table/Table';
import { Heading } from '@/components/text/Headings';
import { useReleaseColumns } from '@/hooks/releases/columns.releases';
import UserLayout from '@/containers/UserLayout';
import { useLazyFetchReleasesQuery } from '@/state/api/apiQuerySlice';
import {
  setCreateReleaseModal,
  setReleasePage,
  setReleaseSize,
  setReleasesList,
  setReleaseTotalCount,
  setReleaseTotalPages,
} from '@/state/features/releaseSlice';
import { AppDispatch, RootState } from '@/state/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@/components/inputs/Button';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const ReleasesPage = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { releasesList, page, size, totalCount, totalPages } = useSelector(
    (state: RootState) => state.release
  );

  // INITIALIZE FETCH RELEASES QUERY
  const [
    fetchReleases,
    {
      data: releasesData,
      isFetching: releasesIsFetching,
      isSuccess: releasesIsSuccess,
      isError: releasesIsError,
      error: releasesError,
    },
  ] = useLazyFetchReleasesQuery();

  // FETCH RELEASES
  useEffect(() => {
    fetchReleases({ size, page });
  }, [fetchReleases, page, size]);

  // HANDLE FETCH RELEASES RESPONSE
  useEffect(() => {
    if (releasesIsError) {
      const errorResponse =
        (releasesError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching releases';
      toast.error(errorResponse);
    } else if (releasesIsSuccess) {
      dispatch(setReleasesList(releasesData?.data?.rows));
      dispatch(setReleaseTotalCount(releasesData?.data?.totalCount));
      dispatch(setReleaseTotalPages(releasesData?.data?.totalPages));
    }
  }, [
    releasesIsError,
    releasesIsSuccess,
    releasesData,
    releasesError,
    dispatch,
  ]);

  const { releaseColumns } = useReleaseColumns();

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <nav className="w-full flex items-center gap-3 justify-between">
          <Heading>Releases</Heading>
          <Button
            type="button"
            primary
            onClick={(e) => {
              e.preventDefault();
              dispatch(setCreateReleaseModal(true));
            }}
            icon={faPlus}
          >
            Add new release
          </Button>
        </nav>
        <section className="w-full flex flex-col gap-2">
            <Table
              columns={releaseColumns}
              data={releasesList}
              page={page}
              size={size}
              totalCount={totalCount}
              totalPages={totalPages}
              setPage={setReleasePage}
              setSize={setReleaseSize}
              isLoading={releasesIsFetching}
            />
        </section>
      </main>
    </UserLayout>
  );
};

export default ReleasesPage;
