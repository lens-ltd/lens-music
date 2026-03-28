import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Button from "@/components/inputs/Button";
import Combobox from "@/components/inputs/Combobox";
import Input from "@/components/inputs/Input";
import Modal from "@/components/modals/Modal";
import { useLazyFetchReleasesQuery } from "@/state/api/apiQuerySlice";
import {
  useCreateRelatedRelease,
  useDeleteRelatedRelease,
  useFetchRelatedReleases,
  useUpdateRelatedRelease,
} from "@/hooks/releases/related-release.hooks";
import { Release } from "@/types/models/release.types";
import {
  RelatedRelease,
  RelatedReleasePayload,
  RelatedReleaseRelationType,
} from "@/types/models/relatedRelease.types";
import { capitalizeString } from "@/utils/strings.helper";

const relationTypeOptions = Object.values(RelatedReleaseRelationType).map(
  (value) => ({
    label: capitalizeString(value),
    value,
  }),
);

const EMPTY_FORM: RelatedReleasePayload = {
  relatedReleaseId: undefined,
  relationType: RelatedReleaseRelationType.IS_EQUIVALENT_TO,
  externalId: "",
};

const RelatedReleasesSection = ({ releaseId }: { releaseId: string }) => {
  const { fetchRelatedReleases, data, isFetching } = useFetchRelatedReleases();
  const { createRelatedRelease, isLoading: isCreating } =
    useCreateRelatedRelease();
  const { updateRelatedRelease, isLoading: isUpdating } =
    useUpdateRelatedRelease();
  const { deleteRelatedRelease, isLoading: isDeleting } =
    useDeleteRelatedRelease();
  const [fetchReleases, { data: releasesResponse }] =
    useLazyFetchReleasesQuery();

  const [createForm, setCreateForm] =
    useState<RelatedReleasePayload>(EMPTY_FORM);
  const [editingRelatedRelease, setEditingRelatedRelease] =
    useState<RelatedRelease | null>(null);
  const [editForm, setEditForm] = useState<RelatedReleasePayload>(EMPTY_FORM);

  const relatedReleases: RelatedRelease[] = data?.data ?? [];
  const releaseOptions = useMemo(
    () =>
      ((releasesResponse?.data?.rows as Release[] | undefined) ?? [])
        .filter((release) => release.id !== releaseId)
        .map((release) => ({
          label: release.title,
          value: release.id,
        })),
    [releaseId, releasesResponse?.data?.rows],
  );

  useEffect(() => {
    if (!releaseId) return;
    fetchRelatedReleases({ releaseId });
    fetchReleases({ page: 0, size: 100 });
  }, [fetchRelatedReleases, fetchReleases, releaseId]);

  const refresh = async () => {
    await fetchRelatedReleases({ releaseId });
  };

  const validateForm = (form: RelatedReleasePayload) => {
    if (!form.relatedReleaseId?.trim() && !form.externalId?.trim()) {
      toast.error("Select a related release or provide an external ID.");
      return false;
    }

    if (!form.relationType) {
      toast.error("Select a relation type.");
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateForm(createForm)) return;

    try {
      await createRelatedRelease({
        releaseId,
        body: {
          relatedReleaseId: createForm.relatedReleaseId || undefined,
          relationType: createForm.relationType,
          externalId: createForm.externalId?.trim() || undefined,
        },
      }).unwrap();
      toast.success("Related release added.");
      setCreateForm(EMPTY_FORM);
      await refresh();
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Unable to add related release.";
      toast.error(message);
    }
  };

  const openEdit = (row: RelatedRelease) => {
    setEditingRelatedRelease(row);
    setEditForm({
      relatedReleaseId: row.relatedReleaseId || undefined,
      relationType: row.relationType,
      externalId: row.externalId || "",
    });
  };

  const handleUpdate = async () => {
    if (!editingRelatedRelease || !validateForm(editForm)) return;

    try {
      await updateRelatedRelease({
        releaseId,
        relatedReleaseId: editingRelatedRelease.id,
        body: {
          relatedReleaseId: editForm.relatedReleaseId || undefined,
          relationType: editForm.relationType,
          externalId: editForm.externalId?.trim() || undefined,
        },
      }).unwrap();
      toast.success("Related release updated.");
      setEditingRelatedRelease(null);
      await refresh();
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Unable to update related release.";
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRelatedRelease({
        releaseId,
        relatedReleaseId: id,
      }).unwrap();
      toast.success("Related release removed.");
      await refresh();
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Unable to remove related release.";
      toast.error(message);
    }
  };

  return (
    <>
      <section className="rounded-xl border border-[color:var(--lens-sand)]/70 bg-white p-4 sm:p-5">
        <header className="mb-4 space-y-1">
          <h3 className="text-sm font-medium text-[color:var(--lens-ink)]">
            Related releases
          </h3>
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            Capture remasters, equivalent releases, and replacement
            relationships directly in the release workflow.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-3">
          <Combobox
            label="Release"
            options={releaseOptions}
            value={createForm.relatedReleaseId || ""}
            onChange={(value) =>
              setCreateForm((current) => ({
                ...current,
                relatedReleaseId: value || undefined,
              }))
            }
            placeholder="Select existing release"
          />
          <Combobox
            label="Relation type"
            options={relationTypeOptions}
            value={createForm.relationType || ""}
            onChange={(value) =>
              setCreateForm((current) => ({
                ...current,
                relationType: value as RelatedReleaseRelationType,
              }))
            }
          />
          <Input
            label="External ID (optional)"
            value={createForm.externalId || ""}
            onChange={(event) =>
              setCreateForm((current) => ({
                ...current,
                externalId: event.target.value,
              }))
            }
            placeholder="Use when target release is external"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            primary
            type="button"
            onClick={() => void handleCreate()}
            isLoading={isCreating}
          >
            Add related release
          </Button>
        </div>

        <div className="mt-5 border-t border-[color:var(--lens-sand)]/50 pt-4">
          {isFetching ? (
            <p className="text-[12px] text-[color:var(--lens-ink)]/55">
              Loading related releases...
            </p>
          ) : relatedReleases.length === 0 ? (
            <p className="text-[12px] text-[color:var(--lens-ink)]/55">
              No related releases linked yet.
            </p>
          ) : (
            <ul className="flex list-none flex-col gap-2 p-0">
              {relatedReleases.map((row) => (
                <li
                  key={row.id}
                  className="flex items-start justify-between gap-3 rounded-md border border-[color:var(--lens-sand)]/40 p-3 text-[12px]"
                >
                  <div className="space-y-0.5">
                    <p className="font-medium text-[color:var(--lens-ink)]">
                      {row.relatedRelease?.title ||
                        row.externalId ||
                        "External release"}
                    </p>
                    <p className="text-[11px] text-[color:var(--lens-ink)]/55">
                      {row.relationType}
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
                      onClick={() => void handleDelete(row.id)}
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
        isOpen={Boolean(editingRelatedRelease)}
        onClose={() => setEditingRelatedRelease(null)}
        heading="Edit related release"
        className="min-w-[min(720px,92vw)]"
      >
        <section className="flex flex-col gap-4 p-1">
          <Combobox
            label="Release"
            options={releaseOptions}
            value={editForm.relatedReleaseId || ""}
            onChange={(value) =>
              setEditForm((current) => ({
                ...current,
                relatedReleaseId: value || undefined,
              }))
            }
            placeholder="Select existing release"
          />
          <Combobox
            label="Relation type"
            options={relationTypeOptions}
            value={editForm.relationType || ""}
            onChange={(value) =>
              setEditForm((current) => ({
                ...current,
                relationType: value as RelatedReleaseRelationType,
              }))
            }
          />
          <Input
            label="External ID (optional)"
            value={editForm.externalId || ""}
            onChange={(event) =>
              setEditForm((current) => ({
                ...current,
                externalId: event.target.value,
              }))
            }
          />
          <footer className="flex items-center justify-between gap-3 pt-2">
            <Button
              type="button"
              onClick={() => setEditingRelatedRelease(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              primary
              onClick={() => void handleUpdate()}
              isLoading={isUpdating}
            >
              Save
            </Button>
          </footer>
        </section>
      </Modal>
    </>
  );
};

export default RelatedReleasesSection;
