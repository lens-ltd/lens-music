import Table from '@/components/table/Table';
import { Heading } from '@/components/text/Headings';
import { useReleaseColumns } from '@/hooks/releases/columns.releases';
import UserLayout from '@/containers/UserLayout';
import {
  setCreateReleaseModal,
} from '@/state/features/releaseSlice';
import { AppDispatch, RootState } from '@/state/store';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Button from '@/components/inputs/Button';
import { useFetchReleases } from '@/hooks/releases/release.hooks';
import DeleteRelease from './DeleteRelease';

import { LuPlus } from 'react-icons/lu';

const ReleasesPage = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { releasesList, deleteReleaseModal } = useSelector(
    (state: RootState) => state.release
  );

  // INITIALIZE FETCH RELEASES QUERY
  const { fetchReleases, isFetching, page, size, totalCount, totalPages, setPage, setSize } = useFetchReleases();
  const filters = useMemo(
    () => ({
      status: searchParams.get('status') || undefined,
      digitalReleaseDateFrom:
        searchParams.get('digitalReleaseDateFrom') || undefined,
      digitalReleaseDateTo:
        searchParams.get('digitalReleaseDateTo') || undefined,
    }),
    [searchParams],
  );
  const hasFilters = Boolean(
    filters.status ||
      filters.digitalReleaseDateFrom ||
      filters.digitalReleaseDateTo,
  );

  // FETCH RELEASES
  useEffect(() => {
    if (!deleteReleaseModal) {
      fetchReleases({ size, page, ...filters });
    }
  }, [fetchReleases, size, page, deleteReleaseModal, filters]);

  useEffect(() => {
    setPage(0);
  }, [filters, setPage]);

  const { releaseColumns } = useReleaseColumns();

  return (
    <UserLayout>
      <div className="w-full flex flex-col gap-4">
        <nav className="w-full flex items-center gap-3 justify-between">
          <div>
            <Heading>Releases</Heading>
            <p className="type-meta mt-1">
              Draft, review, and deliver your catalog to stores.
            </p>
          </div>
          <Button
            type="button"
            primary
            onClick={(e) => {
              e.preventDefault();
              dispatch(setCreateReleaseModal(true));
            }}
            icon={LuPlus}
          >
            Create release
          </Button>
        </nav>
        {hasFilters ? (
          <aside className="flex flex-col gap-3 rounded-md bg-(--surface) px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="type-meta">
              Showing a filtered catalog
              {filters.status ? ` · ${filters.status.toLowerCase()}` : ''}
              {filters.digitalReleaseDateFrom && filters.digitalReleaseDateTo
                ? ` · ${filters.digitalReleaseDateFrom} to ${filters.digitalReleaseDateTo}`
                : ''}
            </p>
            <Button
              styled={false}
              onClick={(event) => {
                event.preventDefault();
                setSearchParams({});
              }}
            >
              Clear filters
            </Button>
          </aside>
        ) : null}
        <section className="w-full flex flex-col gap-2">
          <Table
            columns={releaseColumns}
            data={releasesList}
            page={page}
            size={size}
            totalCount={totalCount}
            totalPages={totalPages}
            setPage={setPage}
            setSize={setSize}
            isLoading={isFetching}
          />
        </section>
      </div>
      <DeleteRelease />
    </UserLayout>
  );
};

export default ReleasesPage;
