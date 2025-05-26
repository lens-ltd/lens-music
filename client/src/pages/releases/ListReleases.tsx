import Button from '@/components/inputs/Button';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import Loader from '@/components/inputs/Loader';
import Table from '@/components/table/Table';
import { Heading } from '@/components/text/Headings';
import { useReleaseColumns } from '@/constants/release.constants';
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
import { Release } from '@/types/models/release.types';
import {
  faInfo,
  faPenToSquare,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row } from '@tanstack/react-table';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const ListReleases = () => {
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

  // RELEASE EXTENDED COLUMNS
  const releaseExtendedColumns = [
    ...useReleaseColumns(),
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<Release> }) => {
        return (
          <menu className="w-full flex items-center gap-3">
            <CustomTooltip label="Click to view details">
              <FontAwesomeIcon
                className="p-[6px] px-[10px] rounded-full cursor-pointer bg-primary text-white transition-all ease-in-out duration-200 hover:scale-[1.01]"
                icon={faInfo}
                onClick={(e) => {
                  e.preventDefault();
                  return row?.original;
                }}
              />
            </CustomTooltip>
            <CustomTooltip label="Click to update">
              <FontAwesomeIcon
                className="p-2 rounded-full cursor-pointer bg-primary text-white transition-all ease-in-out duration-200 hover:scale-[1.01]"
                icon={faPenToSquare}
                onClick={(e) => {
                  e.preventDefault();
                  return row?.original;
                }}
              />
            </CustomTooltip>
            <CustomTooltip label="Click to delete" labelClassName="bg-red-600">
              <FontAwesomeIcon
                className="p-2 rounded-full cursor-pointer px-[8.2px] bg-red-600 text-white transition-all ease-in-out duration-200 hover:scale-[1.01]"
                icon={faTrash}
                onClick={(e) => {
                  e.preventDefault();
                  return row?.original;
                }}
              />
            </CustomTooltip>
          </menu>
        );
      },
    },
  ];

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <nav className="w-full flex items-center gap-3 justify-between">
          <Heading>Releases</Heading>
          <Button
            primary
            onClick={(e) => {
              e.preventDefault();
              dispatch(setCreateReleaseModal(true));
            }}
          >
            <menu className="w-full flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} />
              <p>Add new release</p>
            </menu>
          </Button>
        </nav>
        <section className="w-full flex flex-col gap-2">
          {releasesIsFetching ? (
            <figure className="w-full min-h-[60vh] items-center justify-center">
              <Loader primary />
            </figure>
          ) : (
            <Table
              columns={releaseExtendedColumns}
              data={releasesList}
              page={page}
              size={size}
              totalCount={totalCount}
              totalPages={totalPages}
              setPage={setReleasePage}
              setSize={setReleaseSize}
            />
          )}
        </section>
      </main>
    </UserLayout>
  );
};

export default ListReleases;
