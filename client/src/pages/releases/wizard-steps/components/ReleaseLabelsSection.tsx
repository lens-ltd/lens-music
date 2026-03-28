import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Button from "@/components/inputs/Button";
import Combobox from "@/components/inputs/Combobox";
import Input from "@/components/inputs/Input";
import Loader from "@/components/inputs/Loader";
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
import { capitalizeString } from "@/utils/strings.helper";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Check } from "lucide-react";

const MIN_LABEL_SEARCH_CHARS = 3;

const labelTypeOptions = Object.values(ReleaseLabelType).map((value) => ({
  label: capitalizeString(value),
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
  const [fetchLabels, { isFetching: isSearchingLabels }] =
    useLazyFetchLabelsQuery();

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

  // Debounced label search state
  const [labelSearchTerm, setLabelSearchTerm] = useState("");
  const [labelSearchResults, setLabelSearchResults] = useState<Label[]>([]);
  const [isLabelSearchPending, setIsLabelSearchPending] = useState(false);
  const [selectedLabelId, setSelectedLabelId] = useState("");
  const [selectedLabelName, setSelectedLabelName] = useState("");
  const latestSearchRequestRef = useRef(0);

  const releaseLabels: ReleaseLabel[] = data?.data ?? [];

  useEffect(() => {
    if (!releaseId) return;
    fetchReleaseLabels({ releaseId });
  }, [fetchReleaseLabels, releaseId]);

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

  // Debounced label search
  useEffect(() => {
    const trimmed = labelSearchTerm.trim();

    if (trimmed.length < MIN_LABEL_SEARCH_CHARS) {
      setLabelSearchResults([]);
      setIsLabelSearchPending(false);
      return;
    }

    if (selectedLabelId && trimmed === selectedLabelName) {
      setLabelSearchResults([]);
      setIsLabelSearchPending(false);
      return;
    }

    const requestId = latestSearchRequestRef.current + 1;
    latestSearchRequestRef.current = requestId;
    setIsLabelSearchPending(true);

    const timeout = window.setTimeout(() => {
      void (async () => {
        try {
          const response = await fetchLabels({
            page: 0,
            size: 10,
            searchKey: trimmed,
          }).unwrap();

          if (latestSearchRequestRef.current !== requestId) return;
          setLabelSearchResults(response?.data?.rows ?? []);
        } catch {
          if (latestSearchRequestRef.current !== requestId) return;
          setLabelSearchResults([]);
          toast.error("Unable to search labels.");
        } finally {
          if (latestSearchRequestRef.current === requestId) {
            setIsLabelSearchPending(false);
          }
        }
      })();
    }, 500);

    return () => {
      window.clearTimeout(timeout);
      setIsLabelSearchPending(false);
    };
  }, [labelSearchTerm, fetchLabels, selectedLabelId, selectedLabelName]);

  const handleLabelSearchChange = useCallback(
    (value: string) => {
      setLabelSearchTerm(value);
      if (selectedLabelId && value !== selectedLabelName) {
        setSelectedLabelId("");
        setSelectedLabelName("");
        setCreateForm((current) => ({ ...current, labelId: "" }));
      }
    },
    [selectedLabelId, selectedLabelName],
  );

  const handleSelectLabel = useCallback((label: Label) => {
    setSelectedLabelId(label.id);
    setSelectedLabelName(label.name);
    setLabelSearchTerm(label.name);
    setLabelSearchResults([]);
    setCreateForm((current) => ({ ...current, labelId: label.id }));
  }, []);

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
      setLabelSearchTerm("");
      setSelectedLabelId("");
      setSelectedLabelName("");
      setLabelSearchResults([]);
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
            Optionally assign labels to this release. If no label is set, the
            primary artist will be used as fallback in DDEX submissions.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-2">
            <span className="pl-0.5 text-[12px] leading-none text-[color:var(--lens-ink)]">
              Label
            </span>
            <search className="relative">
              <Input
                value={labelSearchTerm}
                onChange={(event) =>
                  handleLabelSearchChange(event.target.value)
                }
                placeholder="Search labels by name"
                prefixIcon={faSearch}
              />
              {labelSearchTerm?.trim()?.length > 0 && (
                <aside className="mt-2 animate-in fade-in duration-150 rounded-md border border-[color:var(--lens-sand)]/70 bg-white shadow-sm">
                  {isLabelSearchPending || isSearchingLabels ? (
                    <span className="flex items-center gap-2 px-3 py-2 text-[12px] text-[color:var(--lens-ink)]/55">
                      <Loader
                        size="small"
                        className="text-[color:var(--lens-ink)]/40"
                      />
                      Searching labels...
                    </span>
                  ) : labelSearchTerm?.trim()?.length <
                    MIN_LABEL_SEARCH_CHARS ? (
                    <p className="px-3 py-2 text-[12px] text-[color:var(--lens-ink)]/55">
                      Type at least {MIN_LABEL_SEARCH_CHARS} characters to
                      search.
                    </p>
                  ) : labelSearchResults?.length ? (
                    <ul className="max-h-56 overflow-y-auto py-1">
                      {labelSearchResults.map((label) => {
                        const isSelected = selectedLabelId === label.id;
                        return (
                          <li key={label.id}>
                            <button
                              type="button"
                              onClick={() => handleSelectLabel(label)}
                              className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left transition-colors hover:bg-[color:var(--lens-sand)]/20"
                            >
                              <p className="flex flex-col items-start">
                                <span className="text-[12px] text-[color:var(--lens-ink)]">
                                  {label.name}
                                </span>
                                <span className="text-[11px] text-[color:var(--lens-ink)]/55">
                                  {[label.email, label.country]
                                    .filter(Boolean)
                                    .join(" · ") || "No extra details"}
                                </span>
                              </p>
                              {isSelected && (
                                <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    !(isLabelSearchPending || selectedLabelId) && (
                      <p className="px-3 py-2 text-[12px] text-[color:var(--lens-ink)]/55">
                        No labels found.
                      </p>
                    )
                  )}
                </aside>
              )}
            </search>
          </label>
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
                      DDEX Party ID: {releaseLabel?.label?.ddexPartyId || "—"}
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
