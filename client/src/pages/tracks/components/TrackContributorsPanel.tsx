import Button from "@/components/inputs/Button";
import Combobox from "@/components/inputs/Combobox";
import Input from "@/components/inputs/Input";
import Loader from "@/components/inputs/Loader";
import { Contributor } from "@/types/models/contributor.types";
import { ContributorRole } from "@/types/models/releaseContributor.types";
import { TrackContributor } from "@/types/models/track.types";
import { capitalizeString } from "@/utils/strings.helper";
import {
  faExternalLinkAlt,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Check } from "lucide-react";
import { FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MIN_CONTRIBUTOR_SEARCH_CHARS, toTitleCase } from "./trackForm.helpers";

type TrackContributorsPanelProps = {
  contributorSearchTerm: string;
  contributorSearchResults: Contributor[];
  selectedContributorId: string;
  selectedContributorRole: ContributorRole;
  trackContributors: TrackContributor[];
  isSearchingContributors: boolean;
  isCreatingContributor: boolean;
  isDeletingContributor: boolean;
  onContributorSearchChange: (value: string) => void;
  onSelectContributor: (contributor: Contributor) => void;
  onSelectRole: (value: ContributorRole) => void;
  onAddContributor: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onDeleteContributor: (trackContributorId: string) => Promise<void>;
};

const roleOptions = Object.values(ContributorRole).map((role) => ({
  value: role,
  label: capitalizeString(role),
}));

const getContributorLabel = (contributor: Contributor) =>
  contributor.displayName ||
  contributor.name ||
  contributor.email ||
  "Unnamed contributor";

const TrackContributorsPanel = ({
  contributorSearchTerm,
  contributorSearchResults,
  selectedContributorId,
  selectedContributorRole,
  trackContributors,
  isSearchingContributors,
  isCreatingContributor,
  isDeletingContributor,
  onContributorSearchChange,
  onSelectContributor,
  onSelectRole,
  onAddContributor,
  onDeleteContributor,
}: TrackContributorsPanelProps) => {
  return (
    <section className="rounded-md border border-[color:var(--lens-sand)]/70 bg-white p-4">
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
        onSubmit={(event) => void onAddContributor(event)}
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
                  onContributorSearchChange(event.target.value)
                }
                placeholder="Search contributors by name, email, phone, or country"
                prefixIcon={faSearch}
              />
              {contributorSearchTerm?.trim()?.length > 0 && (
                <aside className="mt-2 animate-in fade-in duration-150 rounded-md border border-[color:var(--lens-sand)]/70 bg-white shadow-sm">
                  {isSearchingContributors ? (
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
                              className={`flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left transition-colors hover:bg-[color:var(--lens-sand)]/20`}
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
              onChange={(value) => onSelectRole(value as ContributorRole)}
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
        {trackContributors?.length ? (
          trackContributors?.map((trackContributor) => (
            <li
              key={trackContributor?.id}
              className="flex items-start justify-between gap-3 rounded-md p-3 shadow-xs"
            >
              <section className="flex flex-col gap-0.5">
                <p className="text-[12px] font-normal text-[color:var(--lens-ink)]">
                  {trackContributor?.contributor?.name ||
                    trackContributor?.contributor?.displayName ||
                    "Unknown contributor"}
                </p>
                <p className="text-[11px] text-[color:var(--lens-ink)]/55">
                  {toTitleCase(trackContributor?.role)}
                </p>
              </section>
              {isDeletingContributor ? (
                <Loader className="text-primary" />
              ) : (
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={(e) => {
                    e.preventDefault();
                    void onDeleteContributor(trackContributor?.id ?? "");
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
    </section>
  );
};

export default TrackContributorsPanel;
