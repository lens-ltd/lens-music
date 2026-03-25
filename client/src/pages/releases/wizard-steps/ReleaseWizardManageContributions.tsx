import Button from "@/components/inputs/Button";
import Combobox from "@/components/inputs/Combobox";
import Input from "@/components/inputs/Input";
import Loader from "@/components/inputs/Loader";
import { RelaxedHeading } from "@/components/text/Headings";
import {
  useFetchReleaseContributors,
  useCreateReleaseContributor,
  useDeleteReleaseContributor,
  useUpdateReleaseContributor,
} from "@/hooks/releases/release-contributor.hooks";
import {
  useCompleteReleaseNavigationFlow,
  useCreateReleaseNavigationFlow,
} from "@/hooks/releases/navigation.hooks";
import { useAppSelector } from "@/state/hooks";
import { useLazyFetchContributorsQuery } from "@/state/api/apiQuerySlice";
import { Contributor } from "@/types/models/contributor.types";
import { ContributorRole, ReleaseContributor } from "@/types/models/releaseContributor.types";
import { capitalizeString } from "@/utils/strings.helper";
import { MIN_CONTRIBUTOR_SEARCH_CHARS, toTitleCase } from "@/pages/tracks/components/trackForm.helpers";
import {
  faExternalLinkAlt,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Check } from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ReleaseWizardStepProps } from "../ReleaseWizardPage";

const roleOptions = Object.values(ContributorRole).map((role) => ({
  value: role,
  label: capitalizeString(role),
}));

const getContributorLabel = (contributor: Contributor) =>
  contributor.displayName ||
  contributor.name ||
  contributor.email ||
  "Unnamed contributor";

const ReleaseWizardManageContributions = ({
  currentStepName,
  nextStepName,
  previousStepName,
}: ReleaseWizardStepProps) => {
  const { release } = useAppSelector((state) => state.release);
  const { createReleaseNavigationFlow, isLoading: createNavigationFlowIsLoading } =
    useCreateReleaseNavigationFlow();
  const { completeReleaseNavigationFlow, isLoading: completeNavigationFlowIsLoading } =
    useCompleteReleaseNavigationFlow();

  const { fetchReleaseContributors, data: releaseContributorsData } =
    useFetchReleaseContributors();
  const { createReleaseContributor, isLoading: isCreatingContributor } =
    useCreateReleaseContributor();
  const { deleteReleaseContributor, isLoading: isDeletingContributor } =
    useDeleteReleaseContributor();
  const { updateReleaseContributor, isLoading: isUpdatingReleaseContributorSequence } =
    useUpdateReleaseContributor();
  const [fetchContributors, { isFetching: isSearchingContributors }] =
    useLazyFetchContributorsQuery();

  const [selectedContributorId, setSelectedContributorId] = useState("");
  const [selectedContributorRole, setSelectedContributorRole] = useState<ContributorRole>(
    ContributorRole.PRIMARY_ARTIST,
  );
  const [selectedContributorLabel, setSelectedContributorLabel] = useState("");
  const [contributorSearchTerm, setContributorSearchTerm] = useState("");
  const [contributorSearchResults, setContributorSearchResults] = useState<Contributor[]>([]);
  const [isContributorSearchPending, setIsContributorSearchPending] = useState(false);
  const latestSearchRequestRef = useRef(0);

  useEffect(() => {
    if (release?.id) {
      fetchReleaseContributors({ releaseId: release.id });
    }
  }, [release?.id, fetchReleaseContributors]);

  useEffect(() => {
    const trimmedSearchTerm = contributorSearchTerm.trim();

    if (trimmedSearchTerm.length < MIN_CONTRIBUTOR_SEARCH_CHARS) {
      setContributorSearchResults([]);
      setIsContributorSearchPending(false);
      return;
    }

    if (selectedContributorId && selectedContributorLabel === trimmedSearchTerm) {
      setIsContributorSearchPending(false);
      return;
    }

    const requestId = latestSearchRequestRef.current + 1;
    latestSearchRequestRef.current = requestId;

    setIsContributorSearchPending(true);

    const timeout = window.setTimeout(() => {
      void (async () => {
        try {
          const response = await fetchContributors({
            page: 0,
            size: 10,
            searchKey: trimmedSearchTerm,
          }).unwrap();

          if (latestSearchRequestRef.current !== requestId) {
            return;
          }

          setContributorSearchResults(response?.data?.rows ?? []);
        } catch (error) {
          if (latestSearchRequestRef.current !== requestId) {
            return;
          }

          const errorMessage =
            (error as { data?: { message?: string } })?.data?.message ||
            "Unable to search contributors.";
          toast.error(errorMessage);
        } finally {
          if (latestSearchRequestRef.current === requestId) {
            setIsContributorSearchPending(false);
          }
        }
      })();

      return () => {
        setIsContributorSearchPending(false);
      };
    }, 2000);

    return () => {
      clearTimeout(timeout);
      setIsContributorSearchPending(false);
    };
  }, [
    contributorSearchTerm,
    fetchContributors,
    selectedContributorId,
    selectedContributorLabel,
  ]);

  const handleSelectContributor = useCallback((contributor: Contributor) => {
    setSelectedContributorId(contributor.id ?? "");
    const label = getContributorLabel(contributor);
    setSelectedContributorLabel(label);
    setContributorSearchTerm(label);
    setContributorSearchResults([]);
  }, []);

  const handleContributorSearchChange = useCallback((value: string) => {
    setContributorSearchTerm(value);
    if (selectedContributorId) {
      setSelectedContributorId("");
      setSelectedContributorLabel("");
    }
  }, [selectedContributorId]);

  const handleAddContributor = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!release?.id || !selectedContributorId) {
        toast.error("Please select a contributor before adding.");
        return;
      }

      const existing = (releaseContributorsData?.data ?? []) as ReleaseContributor[];
      const isDuplicate = existing.some(
        (rc) =>
          rc.contributorId === selectedContributorId &&
          rc.role === selectedContributorRole,
      );

      if (isDuplicate) {
        toast.error("This contributor already has that role on the release.");
        return;
      }

      try {
        await createReleaseContributor({
          releaseId: release.id,
          contributorId: selectedContributorId,
          role: selectedContributorRole,
        }).unwrap();

        toast.success("Contributor added successfully.");
        setSelectedContributorId("");
        setSelectedContributorLabel("");
        setContributorSearchTerm("");
        setContributorSearchResults([]);
        fetchReleaseContributors({ releaseId: release.id });
      } catch (error) {
        const errorMessage =
          (error as { data?: { message?: string } })?.data?.message ||
          "Failed to add contributor.";
        toast.error(errorMessage);
      }
    },
    [
      release?.id,
      selectedContributorId,
      selectedContributorRole,
      releaseContributorsData,
      createReleaseContributor,
      fetchReleaseContributors,
    ],
  );

  const handleDeleteContributor = useCallback(
    async (releaseContributorId: string) => {
      if (!release?.id) return;

      try {
        await deleteReleaseContributor({ id: releaseContributorId }).unwrap();
        toast.success("Contributor removed successfully.");
        fetchReleaseContributors({ releaseId: release.id });
      } catch (error) {
        const errorMessage =
          (error as { data?: { message?: string } })?.data?.message ||
          "Failed to remove contributor.";
        toast.error(errorMessage);
      }
    },
    [release?.id, deleteReleaseContributor, fetchReleaseContributors],
  );

  const handleUpdateReleaseContributorSequence = useCallback(
    async (releaseContributorId: string, sequenceNumber: number | undefined) => {
      if (!release?.id || sequenceNumber === undefined || Number.isNaN(sequenceNumber)) {
        return;
      }
      const existing = (releaseContributorsData?.data ?? []) as ReleaseContributor[];
      const current = existing.find((rc) => rc.id === releaseContributorId);
      if (current?.sequenceNumber === sequenceNumber) return;
      try {
        await updateReleaseContributor({
          id: releaseContributorId,
          body: { sequenceNumber },
        }).unwrap();
        await fetchReleaseContributors({ releaseId: release.id });
      } catch (error) {
        const errorMessage =
          (error as { data?: { message?: string } })?.data?.message ||
          "Unable to update order.";
        toast.error(errorMessage);
      }
    },
    [
      fetchReleaseContributors,
      release?.id,
      releaseContributorsData?.data,
      updateReleaseContributor,
    ],
  );

  const releaseContributors = (releaseContributorsData?.data ?? []) as ReleaseContributor[];

  return (
    <section className="flex w-full flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-white">
        <RelaxedHeading>Manage Contributions</RelaxedHeading>
      </header>

      <article className="rounded-md border border-[color:var(--lens-sand)]/70 bg-white p-4">
        <header className="space-y-1">
          <h2 className="text-sm font-normal text-[color:var(--lens-ink)]">
            Contributors
          </h2>
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            Add each contributor once per role.
          </p>
          <p className="text-[12px] text-[color:var(--lens-ink)]/55 mt-2">
            Can't find the contributor you're looking for?{" "}
            <a
              href={`/contributors/create?redirect=CLOSE_TAB`}
              target="_blank"
              className="text-[color:var(--lens-blue)] hover:underline underline-offset-2 text-[12px]"
            >
              Create a new contributor{" "}
              <FontAwesomeIcon
                icon={faExternalLinkAlt}
                className="text-[11px] inline-block ml-1"
              />
            </a>
          </p>
        </header>

        <form
          className="w-full flex flex-col gap-4 my-4"
          onSubmit={(event) => void handleAddContributor(event)}
        >
          <section className="w-full grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="pl-0.5 text-[12px] leading-none text-[color:var(--lens-ink)]">
                Contributor
              </span>
              <search className="relative">
                <Input
                  value={contributorSearchTerm}
                  onChange={(event) =>
                    handleContributorSearchChange(event.target.value)
                  }
                  placeholder="Search contributors by name, email, phone, or country"
                  prefixIcon={faSearch}
                />
                {contributorSearchTerm?.trim()?.length > 0 && (
                  <aside className="mt-2 animate-in fade-in duration-150 rounded-md border border-[color:var(--lens-sand)]/70 bg-white shadow-sm">
                    {isSearchingContributors || isContributorSearchPending ? (
                      <span className="flex items-center gap-2 px-3 py-2 text-[12px] text-[color:var(--lens-ink)]/55">
                        <Loader
                          size="small"
                          className="text-[color:var(--lens-ink)]/40"
                        />
                        Searching contributors...
                      </span>
                    ) : contributorSearchTerm?.trim()?.length <
                      MIN_CONTRIBUTOR_SEARCH_CHARS ? (
                      <p className="px-3 py-2 text-[12px] text-[color:var(--lens-ink)]/55">
                        Type at least {MIN_CONTRIBUTOR_SEARCH_CHARS} characters
                        to search.
                      </p>
                    ) : contributorSearchResults?.length ? (
                      <ul className="max-h-56 overflow-y-auto py-1">
                        {contributorSearchResults?.map((contributor) => {
                          const isSelected =
                            selectedContributorId === contributor?.id;
                          return (
                            <li key={contributor?.id}>
                              <button
                                type="button"
                                onClick={() =>
                                  handleSelectContributor(contributor)
                                }
                                className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left transition-colors hover:bg-[color:var(--lens-sand)]/20"
                              >
                                <p className="flex flex-col items-start">
                                  <span className="text-[12px] text-[color:var(--lens-ink)]">
                                    {getContributorLabel(contributor)}
                                  </span>
                                  <span className="text-[11px] text-[color:var(--lens-ink)]/55">
                                    {[
                                      contributor?.email,
                                      contributor?.phoneNumber,
                                      contributor?.country,
                                    ]
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
                      !(isSearchingContributors || selectedContributorId) && (
                        <p className="px-3 py-2 text-[12px] text-[color:var(--lens-ink)]/55">
                          No contributors found.
                        </p>
                      )
                    )}
                  </aside>
                )}
              </search>
            </label>

            <label className="flex flex-col gap-2">
              <span className="pl-0.5 text-[12px] leading-none text-[color:var(--lens-ink)]">
                Role
              </span>
              <Combobox
                options={roleOptions}
                value={selectedContributorRole}
                onChange={(value) =>
                  setSelectedContributorRole(value as ContributorRole)
                }
                readOnly={isSearchingContributors}
              />
            </label>
          </section>

          <Button
            submit
            type="submit"
            primary
            isLoading={isCreatingContributor}
            className="w-fit self-end"
          >
            Add contributor
          </Button>
        </form>

        <ul className="mt-4 flex list-none flex-col gap-2 p-0">
          {releaseContributors?.length ? (
            releaseContributors?.map((releaseContributor) => (
              <li
                key={releaseContributor?.id}
                className="flex items-start justify-between gap-3 rounded-md p-3 shadow-xs"
              >
                <section className="flex flex-col gap-0.5">
                  <p className="text-[12px] font-normal text-[color:var(--lens-ink)]">
                    {releaseContributor?.contributor?.name ||
                      releaseContributor?.contributor?.displayName ||
                      "Unknown contributor"}
                  </p>
                  <p className="text-[11px] text-[color:var(--lens-ink)]/55">
                    {toTitleCase(releaseContributor?.role)}
                  </p>
                  <label className="mt-1 flex items-center gap-2 text-[11px] text-[color:var(--lens-ink)]/70">
                    <span className="shrink-0">Order</span>
                    <input
                      type="number"
                      min={0}
                      className="w-16 rounded border border-[color:var(--lens-sand)]/60 px-1 py-0.5 text-[11px]"
                      defaultValue={releaseContributor.sequenceNumber ?? ""}
                      disabled={isUpdatingReleaseContributorSequence}
                      onBlur={(e) => {
                        const v = e.target.value.trim();
                        const n = v === "" ? undefined : Number(v);
                        if (n !== undefined && Number.isNaN(n)) return;
                        void handleUpdateReleaseContributorSequence(
                          releaseContributor.id,
                          n,
                        );
                      }}
                    />
                  </label>
                </section>
                {isDeletingContributor ? (
                  <Loader className="text-primary" />
                ) : (
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={(e) => {
                      e.preventDefault();
                      void handleDeleteContributor(
                        releaseContributor?.id ?? "",
                      );
                    }}
                    className="text-[12px] cursor-pointer text-red-700 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                )}
              </li>
            ))
          ) : (
            <li className="rounded-md border border-dashed border-[color:var(--lens-sand)]/70 p-3 text-[12px] text-[color:var(--lens-ink)]/55">
              No contributors added yet.
            </li>
          )}
        </ul>
      </article>

      <footer className="w-full flex items-center gap-3 justify-between">
        <Button
          onClick={(e) => {
            e.preventDefault();
            previousStepName &&
              release?.id &&
              createReleaseNavigationFlow({
                releaseId: release.id,
                staticReleaseNavigationStepName: previousStepName,
              });
          }}
        >
          Back
        </Button>
        <Button
          primary
          isLoading={
            createNavigationFlowIsLoading || completeNavigationFlowIsLoading
          }
          disabled={
            createNavigationFlowIsLoading || completeNavigationFlowIsLoading
          }
          onClick={async (e) => {
            e.preventDefault();
            if (!nextStepName || !release?.id) return;
            if (currentStepName) {
              await completeReleaseNavigationFlow({
                staticReleaseNavigationStepName: currentStepName,
                isCompleted: true,
              });
            }
            await createReleaseNavigationFlow({
              releaseId: release.id,
              staticReleaseNavigationStepName: nextStepName,
            });
          }}
        >
          Save and continue
        </Button>
      </footer>
    </section>
  );
};

export default ReleaseWizardManageContributions;
