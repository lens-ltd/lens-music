import Table from '@/components/table/Table';
import { Heading } from '@/components/text/Headings';
import { useReleaseColumns } from '@/hooks/releases/columns.releases';
import UserLayout from '@/containers/UserLayout';
import {
  setCreateReleaseModal,
} from '@/state/features/releaseSlice';
import { AppDispatch, RootState } from '@/state/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@/components/inputs/Button';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useFetchReleases } from '@/hooks/releases/release.hooks';
import DeleteRelease from './DeleteRelease';

const ReleasesPage = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { releasesList, deleteReleaseModal } = useSelector(
    (state: RootState) => state.release
  );

  // INITIALIZE FETCH RELEASES QUERY
  const { fetchReleases, isFetching, page, size, totalCount, totalPages, setPage, setSize } = useFetchReleases();

  // FETCH RELEASES
  useEffect(() => {
    if (!deleteReleaseModal) {
      fetchReleases({ size, page });
    }
  }, [fetchReleases, size, page, deleteReleaseModal]);

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
            setPage={setPage}
            setSize={setSize}
            isLoading={isFetching}
          />
        </section>
      </main>
      <DeleteRelease />
    </UserLayout>
  );
};

export default ReleasesPage;
