import Combobox from '@/components/inputs/Combobox';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Modal from '@/components/modals/Modal';
import Table from '@/components/table/Table';
import { Heading } from '@/components/text/Headings';
import { COUNTRIES_LIST } from '@/constants/countries.constants';
import { labelColumns } from '@/constants/label.constants';
import UserLayout from '@/containers/UserLayout';
import {
  useCreateLabelMutation,
  useUpdateLabelMutation,
} from '@/state/api/apiMutationSlice';
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
  faPenToSquare,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'sonner';

type LabelFormState = {
  name: string;
  email: string;
  description: string;
  country: string;
  ddexPartyId: string;
};

const EMPTY_FORM: LabelFormState = {
  name: '',
  email: '',
  description: '',
  country: '',
  ddexPartyId: '',
};

const ListLabels = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { labelsList, page, size, totalCount, totalPages } = useSelector(
    (state: RootState) => state.label
  );
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  const [formState, setFormState] = useState<LabelFormState>(EMPTY_FORM);

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
  const [createLabel, { isLoading: isCreatingLabel }] = useCreateLabelMutation();
  const [updateLabel, { isLoading: isUpdatingLabel }] = useUpdateLabelMutation();

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

  const countryOptions = useMemo(
    () =>
      COUNTRIES_LIST.map((country) => ({
        label: country.name,
        value: country.code,
      })),
    [],
  );

  const openCreateModal = () => {
    setEditingLabel(null);
    setFormState(EMPTY_FORM);
    setIsLabelModalOpen(true);
  };

  const openEditModal = (label: Label) => {
    setEditingLabel(label);
    setFormState({
      name: label.name || '',
      email: label.email || '',
      description: label.description || '',
      country: label.country || '',
      ddexPartyId: label.ddexPartyId || '',
    });
    setIsLabelModalOpen(true);
  };

  const closeModal = () => {
    setEditingLabel(null);
    setFormState(EMPTY_FORM);
    setIsLabelModalOpen(false);
  };

  const refreshLabels = async () => {
    await fetchLabels({ size, page });
  };

  const handleSaveLabel = async () => {
    if (!formState.name.trim()) {
      toast.error('Label name is required.');
      return;
    }

    const body = {
      name: formState.name.trim(),
      email: formState.email.trim() || undefined,
      description: formState.description.trim() || undefined,
      country: formState.country || undefined,
      ddexPartyId: formState.ddexPartyId.trim() || undefined,
    };

    try {
      if (editingLabel?.id) {
        await updateLabel({
          id: editingLabel.id,
          body,
        }).unwrap();
        toast.success('Label updated successfully.');
      } else {
        await createLabel(body).unwrap();
        toast.success('Label created successfully.');
      }

      await refreshLabels();
      closeModal();
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        'Unable to save label.';
      toast.error(message);
    }
  };

  // LABEL EXTENDED COLUMNS
  const labelExtendedColumns = [
    ...labelColumns,
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<Label> }) => {
        return (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-[11px] text-white transition-all duration-200 hover:scale-[1.01]"
            onClick={(e) => {
              e.preventDefault();
              openEditModal(row.original);
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
            Edit
          </button>
        );
      },
    },
  ];

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <nav className="w-full flex items-center gap-3 justify-between">
          <Heading>Labels</Heading>
          <Button onClick={openCreateModal}>
            <menu className="w-full flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} />
              <p>Add new label</p>
            </menu>
          </Button>
        </nav>
        <section className="w-full flex flex-col gap-2">
          {labelsIsFetching ? (
            <figure className="w-full flex items-center justify-center min-h-[30vh]">
              <Loader className="text-primary" />
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

      <Modal
        isOpen={isLabelModalOpen}
        onClose={closeModal}
        heading={editingLabel ? 'Edit label' : 'Create label'}
        className="min-w-[min(720px,92vw)]"
      >
        <section className="flex flex-col gap-4 p-1">
          <Input
            label="Label name"
            value={formState.name}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            required
            placeholder="Enter label name"
          />
          <Input
            label="Email"
            type="email"
            value={formState.email}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
            placeholder="label@example.com"
          />
          <Combobox
            label="Country"
            options={countryOptions}
            value={formState.country}
            onChange={(value) =>
              setFormState((current) => ({
                ...current,
                country: value,
              }))
            }
            placeholder="Select country"
          />
          <Input
            label="DDEX Party ID"
            value={formState.ddexPartyId}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                ddexPartyId: event.target.value,
              }))
            }
            placeholder="Optional DDEX party identifier"
          />
          <Input
            label="Description"
            value={formState.description}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="Optional label description"
          />

          <footer className="flex items-center justify-between gap-3 pt-2">
            <Button type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="button"
              primary
              onClick={() => void handleSaveLabel()}
              isLoading={isCreatingLabel || isUpdatingLabel}
            >
              Save
            </Button>
          </footer>
        </section>
      </Modal>
    </UserLayout>
  );
};

export default ListLabels;
