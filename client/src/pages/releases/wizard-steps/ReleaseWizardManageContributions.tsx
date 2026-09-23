import Button from "@/components/inputs/Button";
import { BackButton } from "@/components/layout/PageFooter";
import Input from "@/components/inputs/Input";
import Loader from "@/components/inputs/Loader";
import ContributorRoleMultiSelect from "@/components/contributors/ContributorRoleMultiSelect";
import { RelaxedHeading } from "@/components/text/Headings";
import {
  useFetchReleaseContributors,
  useCreateBulkReleaseContributors,
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
import {
  ContributorRole,
  ReleaseContributor,
} from "@/types/models/releaseContributor.types";
import {
  getContributorCreditName,
  getContributorSearchName,
} from "@/utils/contributorCredit.helper";
import {
  MIN_CONTRIBUTOR_SEARCH_CHARS,
  toTitleCase,
} from "@/pages/tracks/components/trackForm.helpers";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ReleaseWizardStepProps } from "../ReleaseWizardPage";

import { LuCheck, LuSearch, LuTrash2 } from 'react-icons/lu';
import { iconButtonDangerClassName } from '@/constants/input.constants';

import ExternalLink from '@/components/ui/ExternalLink';
const ReleaseWizardManageContributions = ({
  currentStepName,
  nextStepName,
  previousStepName,
}: ReleaseWizardStepProps) => {
  const { release } = useAppSelector((state) => state.release);
  const {
    createReleaseNavigationFlow,
    isLoading: createNavigationFlowIsLoading,
  } = useCreateReleaseNavigationFlow();
  const {
    completeReleaseNavigationFlow,
    isLoading: completeNavigationFlowIsLoading,
  } = useCompleteReleaseNavigationFlow();

  const { fetchReleaseContributors, data: releaseContributorsData } =
    useFetchReleaseContributors();
  const {
    createBulkReleaseContributors,
    isLoading: isCreatingContributor,
  } = useCreateBulkReleaseContributors();
  const { deleteReleaseContributor, isLoading: isDeletingContributor } =
    useDeleteReleaseContributor();
  const {
    updateReleaseContributor,
    isLoading: isUpdatingReleaseContributorSequence,
  } = useUpdateReleaseContributor();
  const [fetchContributors, { isFetching: isSearchingContributors }] =
    useLazyFetchContributorsQuery();

  const [selectedContributorId, setSelectedContributorId] = useState("");
  const [selectedContributorRoles, setSelectedContributorRoles] = useState<
    ContributorRole[]
  >([]);
  const [selectedContributorLabel, setSelectedContributorLabel] = useState("");
  const [contributorSearchTerm, setContributorSearchTerm] = useState("");
  const [contributorSearchResults, setContributorSearchResults] = useState<
    Contributor[]
  >([]);
  const [isContributorSearchPending, setIsContributorSearchPending] =
    useState(false);
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

    if (
      selectedContributorId &&
      selectedContributorLabel === trimmedSearchTerm
    ) {
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
    const label = getContributorSearchName(contributor);
    setSelectedContributorLabel(label);
    setContributorSearchTerm(label);
    setContributorSearchResults([]);
    setSelectedContributorRoles([]);
  }, []);

  const handleContributorSearchChange = useCallback(
    (value: string) => {
      setContributorSearchTerm(value);
      if (selectedContributorId) {
        setSelectedContributorId("");
        setSelectedContributorLabel("");
        setSelectedContributorRoles([]);
      }
    },
    [selectedContributorId],
  );

  const handleAddContributor = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!release?.id || !selectedContributorId) {
        toast.error("Please select a contributor before adding.");
        return;
      }

      if (selectedContributorRoles.length === 0) {
        toast.error("Select at least one role before adding.");
        return;
      }

      try {
        const response = await createBulkReleaseContributors({
          releaseId: release.id,
          contributorId: selectedContributorId,
          roles: selectedContributorRoles,
        }).unwrap();

        const addedCount = response?.data?.createdRoles?.length ?? 0;
        toast.success(
          addedCount > 0
            ? `${addedCount} contributor role${addedCount === 1 ? "" : "s"} added.`
            : "Those contributor roles are already assigned.",
        );
        setSelectedContributorId("");
        setSelectedContributorLabel("");
        setSelectedContributorRoles([]);
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
      selectedContributorRoles,
      createBulkReleaseContributors,
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
    async (
      releaseContributorId: string,
      sequenceNumber: number | undefined,
    ) => {
      if (
        !release?.id ||
        sequenceNumber === undefined ||
        Number.isNaN(sequenceNumber)
      ) {
        return;
      }
      const existing = (releaseContributorsData?.data ??
        []) as ReleaseContributor[];
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

  const releaseContributors = (releaseContributorsData?.data ??
    []) as ReleaseContributor[];
  const unavailableRoles = releaseContributors
    .filter(
      (contributor) => contributor.contributorId === selectedContributorId,
    )
    .map((contributor) => contributor.role);
  const hasPrimaryArtist = releaseContributors.some(
    (contributor) => contributor.role === ContributorRole.PRIMARY_ARTIST,
  );

  return (
    <section className="flex w-full flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-white">
        <RelaxedHeading>Manage Contributions</RelaxedHeading>
      </header>

      <article className="card-framed p-5">
        <header className="space-y-1">
          <h2 className="text-sm font-normal text-(--ink)">
            Contributors
          </h2>
          <p className="text-[13px] text-(--muted)">
            Select a contributor once, then add every role they have on this
            release.
          </p>
          <p className="text-[13px] text-(--muted) mt-2">
            Can't find the contributor you're looking for?{" "}
            <ExternalLink href="/contributors/create?redirect=CLOSE_TAB">
              Create a new contributor
            </ExternalLink>
          </p>
        </header>

        <form
          className="w-full flex flex-col gap-4 my-4"
          onSubmit={(event) => void handleAddContributor(event)}
        >
          <section className="grid w-full gap-4">
            <label className="flex flex-col gap-2">
              <span className="pl-0.5 text-[13px] leading-none text-(--ink)">
                Contributor
              </span>
              <search className="relative">
                <Input
                  value={contributorSearchTerm}
                  onChange={(event) =>
                    handleContributorSearchChange(event.target.value)
                  }
                  placeholder="Search contributors by name, email, phone, or country"
                  prefixIcon={LuSearch}
                />
                {contributorSearchTerm?.trim()?.length > 0 && (
                  <aside className="mt-2 animate-in fade-in duration-150 rounded-(--radius-control) bg-(--paper) shadow-(--shadow-menu)">
                    {isSearchingContributors || isContributorSearchPending ? (
                      <span className="flex items-center gap-2 px-3 py-2 text-[13px] text-(--muted)">
                        <Loader
                          size="small"
                          className="text-(--muted)"
                        />
                        Searching contributors...
                      </span>
                    ) : contributorSearchTerm?.trim()?.length <
                      MIN_CONTRIBUTOR_SEARCH_CHARS ? (
                      <p className="px-3 py-2 text-[13px] text-(--muted)">
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
                                className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left transition-colors hover:bg-(--surface)"
                              >
                                <p className="flex flex-col items-start">
                                  <span className="text-[13px] text-(--ink)">
                                    {getContributorSearchName(contributor)}
                                  </span>
                                  <span className="text-xs text-(--muted)">
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
                                  <LuCheck className="h-3.5 w-3.5 shrink-0 text-(--signal)" />
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      !(isSearchingContributors || selectedContributorId) && (
                        <p className="px-3 py-2 text-[13px] text-(--muted)">
                          No contributors found.
                        </p>
                      )
                    )}
                  </aside>
                )}
              </search>
            </label>

            <ContributorRoleMultiSelect
              value={selectedContributorRoles}
              unavailableRoles={unavailableRoles}
              onChange={setSelectedContributorRoles}
              disabled={isSearchingContributors || !selectedContributorId}
            />
          </section>

          <Button
            submit
            type="submit"
            primary
            isLoading={isCreatingContributor}
            disabled={
              isCreatingContributor ||
              !selectedContributorId ||
              selectedContributorRoles.length === 0
            }
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
                  <p className="text-[13px] font-normal text-(--ink)">
                    {getContributorCreditName(
                      releaseContributor?.contributor,
                      releaseContributor.role,
                    )}
                  </p>
                  <p className="text-xs text-(--muted)">
                    {toTitleCase(releaseContributor?.role)}
                  </p>
                  <label className="mt-1 flex items-center gap-2 text-xs text-(--muted)">
                    <span className="shrink-0 text-xs">Order</span>
                    <input
                      type="number"
                      min={0}
                      className="field-chrome h-(--control-sm) min-h-(--control-sm) w-20 px-2"
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
                  <Loader className="text-(--signal)" />
                ) : (
                  <button
                    type="button"
                    aria-label="Delete"
                    className={iconButtonDangerClassName}
                    onClick={(e) => {
                      e.preventDefault();
                      void handleDeleteContributor(
                        releaseContributor?.id ?? "",
                      );
                    }}
                  >
                    <LuTrash2 className="size-4" aria-hidden="true" />
                  </button>
                )}
              </li>
            ))
          ) : (
            <li className="rounded-(--radius-control) bg-(--surface) p-3 text-[13px] text-(--muted)">
              No contributors added yet.
            </li>
          )}
        </ul>
      </article>

      {!hasPrimaryArtist ? (
        <p
          className="rounded-md bg-(--surface) px-4 py-3 text-xs leading-5 text-(--muted)"
          role="status"
        >
          Add at least one primary artist before continuing.
        </p>
      ) : null}

      <footer className="sticky bottom-0 flex w-full items-center justify-between gap-3 bg-white/95 py-4">
        <BackButton
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
        </BackButton>
        <Button
          primary
          isLoading={
            createNavigationFlowIsLoading || completeNavigationFlowIsLoading
          }
          disabled={
            !hasPrimaryArtist ||
            createNavigationFlowIsLoading ||
            completeNavigationFlowIsLoading
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
