import Button from '@/components/inputs/Button';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import Loader from '@/components/inputs/Loader';
import Table from '@/components/table/Table';
import { Heading } from '@/components/text/Headings';
import { artistColumns } from '@/constants/artist.constants';
import UserLayout from '@/containers/UserLayout';
import { useLazyFetchArtistsQuery } from '@/state/api/apiQuerySlice';
import {
  setArtistPage,
  setArtistSize,
  setArtistsList,
  setArtistTotalCount,
  setArtistTotalPages,
} from '@/state/features/artistSlice';
import { AppDispatch, RootState } from '@/state/store';
import { Artist } from '@/types/models/artist.types';
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

const ListArtists = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { artistsList, page, size, totalCount, totalPages } = useSelector(
    (state: RootState) => state.artist
  );

  // INITIALIZE FETCH ARTISTS QUERY
  const [
    fetchArtists,
    {
      data: artistsData,
      error: artistsError,
      isFetching: artistsIsFetching,
      isSuccess: artistsIsSuccess,
      isError: artistsIsError,
    },
  ] = useLazyFetchArtistsQuery();

  // FETCH ARTISTS
  useEffect(() => {
    fetchArtists({ size, page });
  }, [fetchArtists, page, size]);

  // HANDLE FETCH ARTISTS RESPONSE
  useEffect(() => {
    if (artistsIsError) {
      const errorResponse =
        (artistsError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching artists';
      toast.error(errorResponse);
    } else if (artistsIsSuccess) {
      dispatch(setArtistsList(artistsData?.data?.rows));
      dispatch(setArtistTotalCount(artistsData?.data?.totalCount));
      dispatch(setArtistTotalPages(artistsData?.data?.totalPages));
    }
  }, [artistsData, artistsError, artistsIsError, artistsIsSuccess, dispatch]);

  // ARTISTS EXTENDED COLUMNS
  const artistExtendedColumns = [
    ...artistColumns,
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<Artist> }) => {
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
          <Heading>Artists</Heading>
          <Button>
            <menu className="w-full flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} />
              <p>Add new artist</p>
            </menu>
          </Button>
        </nav>
        <section className="w-full flex flex-col gap-2">
          {artistsIsFetching ? (
            <figure className="w-full flex items-center justify-center min-h-[40vh]">
              <Loader primary />
            </figure>
          ) : (
            <Table
              data={artistsList}
              columns={artistExtendedColumns}
              page={page}
              size={size}
              setPage={setArtistPage}
              setSize={setArtistSize}
              totalCount={totalCount}
              totalPages={totalPages}
            />
          )}
        </section>
      </main>
    </UserLayout>
  );
};

export default ListArtists;
