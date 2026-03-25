import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Button from "@/components/inputs/Button";
import Combobox from "@/components/inputs/Combobox";
import Input from "@/components/inputs/Input";
import Modal from "@/components/modals/Modal";
import { useLazyFetchLabelsQuery } from "@/state/api/apiQuerySlice";
import {
  useCreateReleaseLabel,
  useDeleteReleaseLabel,
  useFetchReleaseLabels,
  useUpdateReleaseLabel,
} from "@/hooks/releases/release-label.hooks";
import { Label } from "@/types/models/label.types";
import {
  ReleaseLabel,
  ReleaseLabelType,
} from "@/types/models/releaseLabel.types";

const labelTypeOptions = Object.values(ReleaseLabelType).map((value) => ({
  label: value,
  value,
}));

type LabelFormState = {
  labelId: string;
  type: ReleaseLabelType;
  ownership: string;
};

const ReleaseLabelsSection = ({ releaseId }: { releaseId: string }) => {
  const { fetchReleaseLabels, data, isFetching } = useFetchReleaseLabels();
  const { createReleaseLabel, isLoading: isCreating } = useCreateReleaseLabel();
  const { updateReleaseLabel, isLoading: isUpdating } = useUpdateReleaseLabel();
  const { deleteReleaseLabel, isLoading: isDeleting } = useDeleteReleaseLabel();
  const [fetchLabels, { data: labelsResponse }] = useLazyFetchLabelsQuery();

  const [editingLabel, setEditingLabel] = useState<ReleaseLabel | null>(null);
  const [createForm, setCreateForm] = useState<LabelFormState>({
    labelId: "",
    type: ReleaseLabelType.PRIMARY,
    ownership: "",
  });
  const [editForm, setEditForm] = useState<Omit<LabelFormState, "labelId">>({
    type: ReleaseLabelType.SECONDARY,
    ownership: "",
  });

  const releaseLabels: ReleaseLabel[] = data?.data ?? [];
  const labelOptions = useMemo(
    () =>
      ((labelsResponse?.data?.rows as Label[] | undefined) ?? []).map((label) => ({
        label: label.name,
        value: label.id,
      })),
    [labelsResponse?.data?.rows],
  );

  useEffect(() => {
    if (!releaseId) return;
    fetchReleaseLabels({ releaseId });
    fetchLabels({ size: 100, page: 0 });
  }, [fetchLabels, fetchReleaseLabels, releaseId]);

  useEffect(() => {
    setCreateForm((current) => ({
      ...current,
      type:
        releaseLabels.length === 0
          ? ReleaseLabelType.PRIMARY
          : current.type === ReleaseLabelType.PRIMARY
            ? ReleaseLabelType.SECONDARY
            : current.type,
    }));
  }, [releaseLabels.length]);

  const refresh = async () => {
    await fetchReleaseLabels({ releaseId });
  };

  const handleCreate = async () => {
    if (!createForm.labelId) {
      toast.error("Select a label to add.");
      return;
    }

    try {
      await createReleaseLabel({
        releaseId,
        body: {
          labelId: createForm.labelId,
          type: createForm.type,
          ownership: createForm.ownership.trim() || undefined,
        },
      }).unwrap();
      toast.success("Label added to release.");
      setCreateForm({
        labelId: "",
        type: ReleaseLabelType.SECONDARY,
        ownership: "",
      });
      await refresh();
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Unable to add label.";
      toast.error(message);
    }
  };

  const openEdit = (releaseLabel: ReleaseLabel) => {
    setEditingLabel(releaseLabel);
    setEditForm({
      type: releaseLabel.type,
      ownership: releaseLabel.ownership || "",
    });
  };

  const handleUpdate = async () => {
    if (!editingLabel) return;

    try {
      await updateReleaseLabel({
        releaseId,
        releaseLabelId: editingLabel.id,
        body: {
          type: editForm.type,
          ownership: editForm.ownership.trim() || undefined,
        },
      }).unwrap();
      toast.success("Release label updated.");
      setEditingLabel(null);
      await refresh();
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Unable to update release label.";
      toast.error(message);
    }
  };

  const handleDelete = async (releaseLabelId: string) => {
    try {
      await deleteReleaseLabel({
        releaseId,
        releaseLabelId,
      }).unwrap();
      toast.success("Release label removed.");
      await refresh();
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Unable to remove release label.";
      toast.error(message);
    }
  };

  return (
    <>
      <section className="rounded-xl border border-[color:var(--lens-sand)]/70 bg-white p-4 sm:p-5">
        <header className="mb-4 space-y-1">
          <h3 className="text-sm font-medium text-[color:var(--lens-ink)]">
            Release labels
          </h3>
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            Assign at least one label to this release. One label must remain
            primary before validation can pass.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-3">
          <Combobox
            label="Label"
            options={labelOptions}
            value={createForm.labelId}
            onChange={(value) =>
              setCreateForm((current) => ({ ...current, labelId: value }))
            }
            placeholder="Select label"
          />
          <Combobox
            label="Role"
            options={labelTypeOptions}
            value={createForm.type}
            onChange={(value) =>
              setCreateForm((current) => ({
                ...current,
                type: value as ReleaseLabelType,
              }))
            }
            placeholder="Select role"
          />
          <Input
            label="Ownership (optional)"
            value={createForm.ownership}
            onChange={(event) =>
              setCreateForm((current) => ({
                ...current,
                ownership: event.target.value,
              }))
            }
            placeholder="e.g. 100%"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button primary type="button" onClick={() => void handleCreate()} isLoading={isCreating}>
            Add label
          </Button>
        </div>

        <div className="mt-5 border-t border-[color:var(--lens-sand)]/50 pt-4">
          {isFetching ? (
            <p className="text-[12px] text-[color:var(--lens-ink)]/55">Loading labels...</p>
          ) : releaseLabels.length === 0 ? (
            <p className="text-[12px] text-[color:var(--lens-ink)]/55">
              No labels assigned yet.
            </p>
          ) : (
            <ul className="flex list-none flex-col gap-2 p-0">
              {releaseLabels.map((releaseLabel) => (
                <li
                  key={releaseLabel.id}
                  className="flex items-start justify-between gap-3 rounded-md border border-[color:var(--lens-sand)]/40 p-3 text-[12px]"
                >
                  <div className="space-y-0.5">
                    <p className="font-medium text-[color:var(--lens-ink)]">
                      {releaseLabel.label?.name || "Unknown label"}
                    </p>
                    <p className="text-[11px] text-[color:var(--lens-ink)]/55">
                      {releaseLabel.type}
                      {releaseLabel.ownership
                        ? ` · Ownership: ${releaseLabel.ownership}`
                        : ""}
                    </p>
                    <p className="text-[11px] text-[color:var(--lens-ink)]/55">
                      DDEX Party ID: {releaseLabel.label?.ddexPartyId || "Missing"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(releaseLabel)}
                      className="text-[11px] text-[color:var(--lens-blue)] hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(releaseLabel.id)}
                      disabled={isDeleting}
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
      </section>

      <Modal
        isOpen={Boolean(editingLabel)}
        onClose={() => setEditingLabel(null)}
        heading="Edit release label"
        className="min-w-[min(640px,92vw)]"
      >
        <section className="flex flex-col gap-4 p-1">
          <Input
            label="Label"
            value={editingLabel?.label?.name || ""}
            readOnly
          />
          <Combobox
            label="Role"
            options={labelTypeOptions}
            value={editForm.type}
            onChange={(value) =>
              setEditForm((current) => ({
                ...current,
                type: value as ReleaseLabelType,
              }))
            }
          />
          <Input
            label="Ownership (optional)"
            value={editForm.ownership}
            onChange={(event) =>
              setEditForm((current) => ({
                ...current,
                ownership: event.target.value,
              }))
            }
          />
          <footer className="flex items-center justify-between gap-3 pt-2">
            <Button type="button" onClick={() => setEditingLabel(null)}>
              Cancel
            </Button>
            <Button type="button" primary onClick={() => void handleUpdate()} isLoading={isUpdating}>
              Save
            </Button>
          </footer>
        </section>
      </Modal>
    </>
  );
};

export default ReleaseLabelsSection;
