import { useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "@/utils/errors.helper";
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
import { useDebouncedValue } from "@/hooks/common/debounce.hooks";
import WizardQueryError from "./WizardQueryError";

const relationTypeOptions = Object.values(RelatedReleaseRelationType).map(
  (value) => ({
    label: capitalizeString(value),
    value,
  }),
);

const RELEASE_SEARCH_SIZE = 20;

const EMPTY_FORM: RelatedReleasePayload = {
  relatedReleaseId: undefined,
  relationType: RelatedReleaseRelationType.IS_EQUIVALENT_TO,
  externalId: "",
};

const RelatedReleasesSection = ({ releaseId }: { releaseId: string }) => {
  const { fetchRelatedReleases, data, isFetching, isError, error } =
    useFetchRelatedReleases();
  const { createRelatedRelease, isLoading: isCreating } =
    useCreateRelatedRelease();
  const { updateRelatedRelease, isLoading: isUpdating } =
    useUpdateRelatedRelease();
  const { deleteRelatedRelease, isLoading: isDeleting } =
    useDeleteRelatedRelease();
  const [fetchReleases, { data: releasesResponse }] =
    useLazyFetchReleasesQuery();
  const [releaseSearch, setReleaseSearch] = useState("");
  const debouncedReleaseSearch = useDebouncedValue(releaseSearch.trim());

  const [createForm, setCreateForm] =
    useState<RelatedReleasePayload>(EMPTY_FORM);
  const [editingRelatedRelease, setEditingRelatedRelease] =
    useState<RelatedRelease | null>(null);
  const [editForm, setEditForm] = useState<RelatedReleasePayload>(EMPTY_FORM);

  const relatedReleases: RelatedRelease[] = useMemo(
    () => data?.data ?? [],
    [data?.data],
  );

  // Titles of every release seen so far, so a selected release keeps its
  // label when the search results no longer include it.
  const knownReleaseTitles = useMemo(() => {
    const titles = new Map<string, string>();
    relatedReleases.forEach((row) => {
      if (row.relatedRelease) {
        titles.set(row.relatedRelease.id, row.relatedRelease.title);
      }
    });
    ((releasesResponse?.data?.rows as Release[] | undefined) ?? []).forEach(
      (release) => titles.set(release.id, release.title),
    );
    return titles;
  }, [relatedReleases, releasesResponse?.data?.rows]);

  const getReleaseOptions = (selectedId?: string) => {
    const options: { label: string; value: string }[] = (
      (releasesResponse?.data?.rows as Release[] | undefined) ?? []
    )
      .filter((release) => release.id !== releaseId)
      .map((release) => ({ label: release.title, value: release.id }));
    const selectedTitle = selectedId && knownReleaseTitles.get(selectedId);
    if (
      selectedId &&
      selectedTitle &&
      !options.some((option) => option.value === selectedId)
    ) {
      options.unshift({ label: selectedTitle, value: selectedId });
    }
    return options;
  };

  useEffect(() => {
    if (!releaseId) return;
    fetchRelatedReleases({ releaseId });
  }, [fetchRelatedReleases, releaseId]);

  // The server searches by title or UPC; the picker shows the first matches.
  useEffect(() => {
    fetchReleases({
      page: 0,
      size: RELEASE_SEARCH_SIZE,
      searchKey: debouncedReleaseSearch || undefined,
    });
  }, [fetchReleases, debouncedReleaseSearch]);

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
      toast.error(getApiErrorMessage(error, "Unable to add related release."));
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
      toast.error(getApiErrorMessage(error, "Unable to update related release."));
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
      toast.error(getApiErrorMessage(error, "Unable to remove related release."));
    }
  };

  return (
    <>
      <section className="card-framed p-5">
        <header className="mb-4 space-y-1">
          <h3 className="text-sm text-(--ink)">
            Related releases
          </h3>
          <p className="text-[13px] text-(--muted)">
            Capture remasters, equivalent releases, and replacement
            relationships directly in the release workflow.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-3">
          <Combobox
            label="Release"
            options={getReleaseOptions(createForm.relatedReleaseId)}
            onSearchChange={setReleaseSearch}
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

        <div className="mt-5 pt-4">
          {isFetching ? (
            <p className="text-[13px] text-(--muted)">
              Loading related releases...
            </p>
          ) : isError ? (
            <WizardQueryError
              title="We couldn't load the related releases."
              error={error}
              onRetry={() => void refresh()}
            />
          ) : relatedReleases.length === 0 ? (
            <p className="text-[13px] text-(--muted)">
              No related releases linked yet.
            </p>
          ) : (
            <ul className="flex list-none flex-col gap-2 p-0">
              {relatedReleases.map((row) => (
                <li
                  key={row.id}
                  className="flex items-start justify-between gap-3 rounded-(--radius-control) bg-(--surface) p-3 text-[13px]"
                >
                  <div className="space-y-0.5">
                    <p className="font-normal text-(--ink)">
                      {row.relatedRelease?.title ||
                        row.externalId ||
                        "External release"}
                    </p>
                    <p className="text-xs text-(--muted)">
                      {row.relationType}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(row)}
                      className="text-xs text-(--signal) hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(row.id)}
                      disabled={isDeleting}
                      className="text-xs text-(--ink) hover:underline"
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
            options={getReleaseOptions(editForm.relatedReleaseId)}
            onSearchChange={setReleaseSearch}
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
