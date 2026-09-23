import Button from "@/components/inputs/Button";
import Input from "@/components/inputs/Input";
import Loader from "@/components/inputs/Loader";
import ContributorRoleMultiSelect from "@/components/contributors/ContributorRoleMultiSelect";
import { Contributor } from "@/types/models/contributor.types";
import { ContributorRole } from "@/types/models/releaseContributor.types";
import { TrackContributor } from "@/types/models/track.types";
import {
  getContributorCreditName,
  getContributorSearchName,
} from "@/utils/contributorCredit.helper";
import { FormEvent } from "react";
import { MIN_CONTRIBUTOR_SEARCH_CHARS } from "./trackForm.helpers";
import { capitalizeString } from "@/utils/strings.helper";

import { LuCheck, LuSearch, LuTrash2 } from 'react-icons/lu';
import { iconButtonDangerClassName } from '@/constants/input.constants';

import ExternalLink from '@/components/ui/ExternalLink';
type TrackContributorsPanelProps = {
  contributorSearchTerm: string;
  contributorSearchResults: Contributor[];
  selectedContributorId: string;
  selectedContributorRoles: ContributorRole[];
  trackContributors: TrackContributor[];
  isSearchingContributors: boolean;
  isCreatingContributor: boolean;
  isDeletingContributor: boolean;
  onContributorSearchChange: (value: string) => void;
  onSelectContributor: (contributor: Contributor) => void;
  onSelectRoles: (value: ContributorRole[]) => void;
  onAddContributor: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onDeleteContributor: (trackContributorId: string) => Promise<void>;
  onUpdateSequence?: (
    trackContributorId: string,
    sequenceNumber: number | undefined,
  ) => Promise<void>;
  isUpdatingSequence?: boolean;
};

const TrackContributorsPanel = ({
  contributorSearchTerm,
  contributorSearchResults,
  selectedContributorId,
  selectedContributorRoles,
  trackContributors,
  isSearchingContributors,
  isCreatingContributor,
  isDeletingContributor,
  onContributorSearchChange,
  onSelectContributor,
  onSelectRoles,
  onAddContributor,
  onDeleteContributor,
  onUpdateSequence,
  isUpdatingSequence,
}: TrackContributorsPanelProps) => {
  const unavailableRoles = trackContributors
    .filter(
      (contributor) => contributor.contributorId === selectedContributorId,
    )
    .map((contributor) => contributor.role);

  return (
    <section className="card-framed p-5">
      <header className="space-y-1">
        <h2 className="text-sm font-normal text-(--ink)">
          Contributors
        </h2>
        <p className="text-[13px] text-(--muted)">
          Select a contributor once, then add every role they have on this
          track.
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
        onSubmit={(event) => void onAddContributor(event)}
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
                  onContributorSearchChange(event.target.value)
                }
                placeholder="Search contributors by name, email, phone, or country"
                prefixIcon={LuSearch}
              />
              {contributorSearchTerm?.trim()?.length > 0 && (
                <aside className="mt-2 animate-in fade-in duration-150 rounded-(--radius-control) bg-(--paper) shadow-(--shadow-menu)">
                  {isSearchingContributors ? (
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
                      Type at least {MIN_CONTRIBUTOR_SEARCH_CHARS} characters to
                      search.
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
                              onClick={() => onSelectContributor(contributor)}
                              className={`flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left transition-colors hover:bg-(--surface)`}
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
            onChange={onSelectRoles}
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
        {trackContributors?.length ? (
          trackContributors?.map((trackContributor) => (
            <li
              key={trackContributor?.id}
              className="flex items-start justify-between gap-3 rounded-md p-3 shadow-xs"
            >
              <section className="flex flex-col gap-0.5">
                <p className="text-[13px] font-normal text-(--ink)">
                  {getContributorCreditName(
                    trackContributor?.contributor,
                    trackContributor.role,
                  )}
                </p>
                <p className="text-xs text-(--muted)">
                  {capitalizeString(trackContributor?.role)}
                </p>
                {onUpdateSequence ? (
                  <label className="mt-1 flex items-center gap-2 text-xs text-(--muted)">
                    <span className="shrink-0">Order</span>
                    <input
                      type="number"
                      min={0}
                      className="field-chrome h-(--control-sm) min-h-(--control-sm) w-20 px-2"
                      defaultValue={
                        trackContributor.sequenceNumber ?? ""
                      }
                      disabled={isUpdatingSequence}
                      onBlur={(e) => {
                        const v = e.target.value.trim();
                        const n = v === "" ? undefined : Number(v);
                        if (n !== undefined && Number.isNaN(n)) return;
                        void onUpdateSequence(trackContributor.id, n);
                      }}
                    />
                  </label>
                ) : null}
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
                    void onDeleteContributor(trackContributor?.id ?? "");
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
    </section>
  );
};

export default TrackContributorsPanel;
