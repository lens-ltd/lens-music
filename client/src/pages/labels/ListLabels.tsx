import Button from '@/components/inputs/Button';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import Loader from '@/components/inputs/Loader';
import Table from '@/components/table/Table';
import { Heading } from '@/components/text/Headings';
import { labelColumns } from '@/constants/label.constants';
import UserLayout from '@/containers/UserLayout';
import { useLazyFetchLabelsQuery } from '@/state/api/apiQuerySlice';
import {
  setLabelPage,
  setLabelSize,
  setLabelsList,
  setLabelTotalCount,
  setLabelTotalPages,
} from '@/state/features/labelSlice';
import { AppDispatch, RootState } from '@/state/store';
import { Label } from '@/types/models/label.types';
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

const ListLabels = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { labelsList, page, size, totalCount, totalPages } = useSelector(
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
    fetchLabels({ size, page });
  }, [fetchLabels, page, size]);

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

  // LABEL EXTENDED COLUMNS
  const labelExtendedColumns = [
    ...labelColumns,
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<Label> }) => {
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
          <Heading>Labels</Heading>
          <Button>
            <menu className="w-full flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} />
              <p>Add new label</p>
            </menu>
          </Button>
        </nav>
        <section className="w-full flex flex-col gap-2">
          {labelsIsFetching ? (
            <figure className="w-full flex items-center justify-center min-h-[30vh]">
              <Loader primary />
            </figure>
          ) : (
            <Table
              columns={labelExtendedColumns}
              data={labelsList}
              page={page}
              size={size}
              totalCount={totalCount}
              totalPages={totalPages}
              setPage={setLabelPage}
              setSize={setLabelSize}
            />
          )}
        </section>
      </main>
    </UserLayout>
  );
};

export default ListLabels;
