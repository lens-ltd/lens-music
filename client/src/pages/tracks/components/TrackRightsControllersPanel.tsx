import Button from '@/components/inputs/Button';
import Combobox from '@/components/inputs/Combobox';
import Input from '@/components/inputs/Input';
import Modal from '@/components/modals/Modal';
import {
  useCreateTrackRightsController,
  useDeleteTrackRightsController,
  useFetchTrackRightsControllers,
  useUpdateTrackRightsController,
} from '@/hooks/tracks/track-rights-controllers.hooks';
import {
  TrackRightType,
  TrackRightsController,
} from '@/types/models/trackRightsController.types';
import { capitalizeString } from '@/utils/strings.helper';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const rightTypeOptions = Object.values(TrackRightType).map((v) => ({
  value: v,
  label: capitalizeString(v.replace(/_/g, ' ').toLowerCase()),
}));

const parseTerritories = (raw: string) =>
  raw
    .split(/[,;\s]+/)
    .map((t) => t.trim().toUpperCase())
    .filter(Boolean);

type TrackRightsControllersPanelProps = {
  trackId: string | undefined;
};

const TrackRightsControllersPanel = ({ trackId }: TrackRightsControllersPanelProps) => {
  const { fetchTrackRightsControllers, data, isFetching, isSuccess } =
    useFetchTrackRightsControllers();
  const { createTrackRightsController, isLoading: isCreating } =
    useCreateTrackRightsController();
  const { updateTrackRightsController, isLoading: isUpdating } =
    useUpdateTrackRightsController();
  const { deleteTrackRightsController, isLoading: isDeleting } =
    useDeleteTrackRightsController();

  const [controllerName, setControllerName] = useState('');
  const [rightType, setRightType] = useState(TrackRightType.MAKING_AVAILABLE_RIGHT);
  const [territoriesInput, setTerritoriesInput] = useState('');
  const [editingRow, setEditingRow] = useState<TrackRightsController | null>(null);
  const [editControllerName, setEditControllerName] = useState('');
  const [editRightType, setEditRightType] = useState(TrackRightType.MAKING_AVAILABLE_RIGHT);
  const [editTerritoriesInput, setEditTerritoriesInput] = useState('');

  useEffect(() => {
    if (trackId) {
      fetchTrackRightsControllers({ trackId });
    }
  }, [fetchTrackRightsControllers, trackId]);

  const rows: TrackRightsController[] = (isSuccess && data?.data) || [];

  const handleCreate = useCallback(async () => {
    if (!trackId) return;
    const name = controllerName.trim();
    if (!name) {
      toast.error('Controller name is required.');
      return;
    }
    const territories = parseTerritories(territoriesInput);
    if (territories.length === 0) {
      toast.error('Enter at least one territory code.');
      return;
    }
    try {
      await createTrackRightsController({
        trackId,
        body: { controllerName: name, rightType, territories },
      }).unwrap();
      toast.success('Rights controller added.');
      setControllerName('');
      setTerritoriesInput('');
      await fetchTrackRightsControllers({ trackId });
    } catch (e) {
      const msg =
        (e as { data?: { message?: string } })?.data?.message ||
        'Could not add rights controller.';
      toast.error(msg);
    }
  }, [
    controllerName,
    createTrackRightsController,
    fetchTrackRightsControllers,
    rightType,
    territoriesInput,
    trackId,
  ]);

  const handleDelete = async (trcId: string) => {
    if (!trackId) return;
    try {
      await deleteTrackRightsController({ trackId, trcId }).unwrap();
      toast.success('Removed.');
      await fetchTrackRightsControllers({ trackId });
    } catch (e) {
      const msg =
        (e as { data?: { message?: string } })?.data?.message ||
        'Could not remove.';
      toast.error(msg);
    }
  };

  const openEdit = (row: TrackRightsController) => {
    setEditingRow(row);
    setEditControllerName(row.controllerName);
    setEditRightType(row.rightType);
    setEditTerritoriesInput(row.territories.join(', '));
  };

  const closeEdit = () => {
    setEditingRow(null);
    setEditControllerName('');
    setEditRightType(TrackRightType.MAKING_AVAILABLE_RIGHT);
    setEditTerritoriesInput('');
  };

  const handleUpdate = async () => {
    if (!trackId || !editingRow) return;

    const territories = parseTerritories(editTerritoriesInput);
    if (!editControllerName.trim()) {
      toast.error('Controller name is required.');
      return;
    }
    if (territories.length === 0) {
      toast.error('Enter at least one territory code.');
      return;
    }

    try {
      await updateTrackRightsController({
        trackId,
        trcId: editingRow.id,
        body: {
          controllerName: editControllerName.trim(),
          rightType: editRightType,
          territories,
        },
      }).unwrap();
      toast.success('Rights controller updated.');
      closeEdit();
      await fetchTrackRightsControllers({ trackId });
    } catch (e) {
      const msg =
        (e as { data?: { message?: string } })?.data?.message ||
        'Could not update rights controller.';
      toast.error(msg);
    }
  };

  if (!trackId) {
    return null;
  }

  return (
    <section className="rounded-md border border-[color:var(--lens-sand)]/70 bg-white p-4">
      <header className="space-y-1">
        <h2 className="text-sm font-normal text-[color:var(--lens-ink)]">
          DDEX rights controllers
        </h2>
        <p className="text-[12px] text-[color:var(--lens-ink)]/55">
          Each track needs at least one row with &quot;Making available&quot;
          before release validation. Use the label or licensor name as
          controller when unsure.
        </p>
      </header>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Input
          label="Controller name"
          value={controllerName}
          onChange={(e) => setControllerName(e.target.value)}
          placeholder="e.g. Your Label LLC"
        />
        <Combobox
          label="Right type"
          options={rightTypeOptions}
          value={rightType}
          onChange={(v) => setRightType(v as TrackRightType)}
        />
        <Input
          className="sm:col-span-2"
          label="Territories"
          value={territoriesInput}
          onChange={(e) => setTerritoriesInput(e.target.value)}
          placeholder="ISO codes, comma-separated (e.g. US, GB)"
        />
      </div>
      <div className="mt-3 flex justify-end">
        <Button primary onClick={() => void handleCreate()} isLoading={isCreating}>
          Add rights controller
        </Button>
      </div>

      <div className="mt-4 border-t border-[color:var(--lens-sand)]/40 pt-3">
        {isFetching ? (
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            No rights controllers yet.
          </p>
        ) : (
          <ul className="flex list-none flex-col gap-2 p-0">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex items-start justify-between gap-2 rounded-md border border-[color:var(--lens-sand)]/30 p-2 text-[12px]"
              >
                <div>
                  <p className="font-medium text-[color:var(--lens-ink)]">
                    {row.controllerName}
                  </p>
                  <p className="text-[11px] text-[color:var(--lens-ink)]/55">
                    {row.rightType} · {row.territories.join(', ')}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(row)}
                    className="text-[11px] text-[color:var(--lens-blue)] hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => void handleDelete(row.id)}
                    className="text-[11px] text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        isOpen={Boolean(editingRow)}
        onClose={closeEdit}
        heading="Edit rights controller"
        className="min-w-[min(720px,92vw)]"
      >
        <section className="flex flex-col gap-4 p-1">
          <Input
            label="Controller name"
            value={editControllerName}
            onChange={(e) => setEditControllerName(e.target.value)}
          />
          <Combobox
            label="Right type"
            options={rightTypeOptions}
            value={editRightType}
            onChange={(v) => setEditRightType(v as TrackRightType)}
          />
          <Input
            label="Territories"
            value={editTerritoriesInput}
            onChange={(e) => setEditTerritoriesInput(e.target.value)}
            placeholder="ISO codes, comma-separated (e.g. US, GB)"
          />
          <footer className="flex items-center justify-between gap-3 pt-2">
            <Button type="button" onClick={closeEdit}>
              Cancel
            </Button>
            <Button type="button" primary onClick={() => void handleUpdate()} isLoading={isUpdating}>
              Save
            </Button>
          </footer>
        </section>
      </Modal>
    </section>
  );
};

export default TrackRightsControllersPanel;
