import Button from "@/components/inputs/Button";
import Input from "@/components/inputs/Input";
import Loader from "@/components/inputs/Loader";
import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { useGetContributor } from "@/hooks/contributors/contributor.hooks";
import { MIN_CONTRIBUTOR_SEARCH_CHARS } from "@/pages/tracks/components/trackForm.helpers";
import { useFetchContributorMemberships } from "@/hooks/contributors/contributorMembership.hooks";
import { useCreateContributorMembershipMutation } from "@/state/api/apiMutationSlice";
import { useLazyFetchContributorsQuery } from "@/state/api/apiQuerySlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import {
  Contributor,
  ContributorMembership,
} from "@/types/models/contributor.types";
import { UUID } from "@/types/common.types";
import { faPlus, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  setDeleteContributorMembershipModal,
  setSelectedContributorMembership,
} from "@/state/features/contributorMembershipSlice";
import DeleteContributorMembership from "./DeleteContributorMembership";

const getContributorLabel = (contributor: Contributor) =>
  contributor.displayName ||
  contributor.name ||
  contributor.email ||
  "Unnamed contributor";

const ContributorMembershipsPage = () => {
  // NAVIGATION
  const navigate = useNavigate();
  const { id } = useParams<{ id: UUID }>();

  // STATE
  const dispatch = useAppDispatch();
  const { contributor } = useAppSelector((state) => state.contributor);
  const { contributorMembershipsList, deleteContributorMembershipModal } =
    useAppSelector((state) => state.contributorMembership);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [selectedMemberLabel, setSelectedMemberLabel] = useState("");
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [memberSearchResults, setMemberSearchResults] = useState<Contributor[]>(
    [],
  );
  const [isMemberSearchPending, setIsMemberSearchPending] = useState(false);
  const latestSearchRequestRef = useRef(0);

  // FETCH CONTRIBUTOR
  const { getContributor, isFetching: isFetchingContributor } =
    useGetContributor();

  useEffect(() => {
    if (id) {
      getContributor({ id });
    }
  }, [getContributor, id]);

  // FETCH MEMBERSHIPS
  const {
    fetchContributorMemberships,
    isFetching: isFetchingMemberships,
    page,
    size,
  } = useFetchContributorMemberships();

  useEffect(() => {
    if (id && !deleteContributorMembershipModal) {
      fetchContributorMemberships({ page, size, parentContributorId: id });
    }
  }, [
    fetchContributorMemberships,
    page,
    size,
    id,
    deleteContributorMembershipModal,
  ]);

  // SEARCH CONTRIBUTORS FOR ADDING
  const [fetchContributors] = useLazyFetchContributorsQuery();

  const existingMemberIds = useMemo(
    () => new Set(contributorMembershipsList.map((m) => m.memberContributorId)),
    [contributorMembershipsList],
  );

  useEffect(() => {
    if (!showAddMember) {
      setMemberSearchResults([]);
      setIsMemberSearchPending(false);
      return;
    }

    const trimmedSearchTerm = memberSearchTerm.trim();

    if (trimmedSearchTerm.length < MIN_CONTRIBUTOR_SEARCH_CHARS) {
      setMemberSearchResults([]);
      setIsMemberSearchPending(false);
      return;
    }

    if (selectedMemberId && trimmedSearchTerm === selectedMemberLabel) {
      setMemberSearchResults([]);
      setIsMemberSearchPending(false);
      return;
    }

    const requestId = latestSearchRequestRef.current + 1;
    latestSearchRequestRef.current = requestId;

    setIsMemberSearchPending(true);

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

          const rows =
            (response?.data?.rows as Contributor[] | undefined) || [];
          setMemberSearchResults(
            rows.filter(
              (candidate) =>
                candidate.id !== id && !existingMemberIds.has(candidate.id),
            ),
          );
        } catch (error) {
          if (latestSearchRequestRef.current !== requestId) {
            return;
          }

          setMemberSearchResults([]);
          const errorMessage =
            (error as { data?: { message?: string } })?.data?.message ||
            "Unable to search contributors.";
          toast.error(errorMessage);
        } finally {
          if (latestSearchRequestRef.current === requestId) {
            setIsMemberSearchPending(false);
          }
        }
      })();
    }, 2000);

    return () => {
      window.clearTimeout(timeout);
      setIsMemberSearchPending(false);
    };
  }, [
    existingMemberIds,
    fetchContributors,
    id,
    memberSearchTerm,
    selectedMemberId,
    selectedMemberLabel,
    showAddMember,
  ]);

  // CREATE MEMBERSHIP
  const [
    createMembership,
    {
      isLoading: isCreating,
      isSuccess: isCreateSuccess,
      isError: isCreateError,
      error: createError,
      reset: resetCreate,
    },
  ] = useCreateContributorMembershipMutation();

  useEffect(() => {
    if (isCreateError) {
      const errorMessage =
        (createError as { data?: { message?: string } })?.data?.message ||
        "An error occurred while adding the member.";
      toast.error(errorMessage);
    }
    if (isCreateSuccess) {
      toast.success("Member added successfully.");
      resetCreate();
      setShowAddMember(false);
      setSelectedMemberId("");
      setSelectedMemberLabel("");
      setMemberSearchTerm("");
      setMemberSearchResults([]);
      if (id) {
        fetchContributorMemberships({ page, size, parentContributorId: id });
      }
    }
  }, [
    isCreateSuccess,
    isCreateError,
    createError,
    resetCreate,
    fetchContributorMemberships,
    id,
    page,
    size,
  ]);

  const handleAddMember = () => {
    if (!id || !selectedMemberId) return;
    createMembership({
      parentContributorId: id,
      memberContributorId: selectedMemberId,
    });
  };

  const handleMemberSearchChange = (value: string) => {
    setMemberSearchTerm(value);

    if (selectedMemberId && value !== selectedMemberLabel) {
      setSelectedMemberId("");
      setSelectedMemberLabel("");
    }
  };

  const handleSelectMember = (member: Contributor) => {
    const label = getContributorLabel(member);
    setSelectedMemberId(member.id);
    setSelectedMemberLabel(label);
    setMemberSearchTerm(label);
    setMemberSearchResults([]);
  };

  const contributorName =
    contributor?.displayName || contributor?.name || "Contributor";

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <Heading isLoading={isFetchingContributor}>
            {contributorName} — Members
          </Heading>
          <p className="text-[12px] text-gray-500">
            Manage the members that belong to this group.
          </p>
        </header>

        <section className="rounded-md border border-gray-200/80 bg-white p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <Heading type="h3">Current members</Heading>
            <Button
              icon={faPlus}
              primary
              onClick={(e) => {
                e.preventDefault();
                setShowAddMember(!showAddMember);
              }}
            >
              Add member
            </Button>
          </div>

          {showAddMember && (
            <div className="flex items-end gap-3 rounded-md border border-dashed border-gray-200 bg-gray-50/60 p-4">
              <div className="flex-1">
                <label className="flex w-full flex-col gap-2">
                  <span className="pl-0.5 text-[12px] leading-none text-[color:var(--lens-ink)]">
                    Select contributor
                  </span>
                  <div className="relative">
                    <Input
                      value={memberSearchTerm}
                      onChange={(event) =>
                        handleMemberSearchChange(event.target.value)
                      }
                      placeholder="Search contributors by name, email, phone, or country"
                      prefixIcon={faSearch}
                    />
                    {memberSearchTerm.trim().length > 0 && (
                      <div className="mt-2 animate-in fade-in duration-150 rounded-md border border-gray-200 bg-white shadow-sm">
                        {isMemberSearchPending ? (
                          <span className="flex items-center gap-2 px-3 py-2 text-[12px] text-gray-500">
                            <Loader size="small" className="text-gray-400" />
                            Searching contributors...
                          </span>
                        ) : memberSearchTerm.trim().length <
                          MIN_CONTRIBUTOR_SEARCH_CHARS ? (
                          <p className="px-3 py-2 text-[12px] text-gray-500">
                            Type at least {MIN_CONTRIBUTOR_SEARCH_CHARS}{" "}
                            characters to search.
                          </p>
                        ) : memberSearchResults.length ? (
                          <ul className="max-h-56 overflow-y-auto py-1">
                            {memberSearchResults.map((member) => {
                              const isSelected = selectedMemberId === member.id;

                              return (
                                <li key={member.id}>
                                  <button
                                    type="button"
                                    onClick={() => handleSelectMember(member)}
                                    className={`flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left transition-colors hover:bg-gray-50 ${
                                      isSelected
                                        ? "border-l-2 border-l-primary bg-gray-100"
                                        : ""
                                    }`}
                                  >
                                    <span className="flex flex-col items-start">
                                      <span className="text-[12px] text-gray-900">
                                        {getContributorLabel(member)}
                                      </span>
                                      <span className="text-[11px] text-gray-500">
                                        {[
                                          member.email,
                                          member.phoneNumber,
                                          member.country,
                                        ]
                                          .filter(Boolean)
                                          .join(" · ") || "No extra details"}
                                      </span>
                                    </span>
                                    {isSelected && (
                                      <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                                    )}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          !(isMemberSearchPending || selectedMemberId) && (
                            <p className="px-3 py-2 text-[12px] text-gray-500">
                              No contributors found.
                            </p>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </label>
              </div>
              <Button
                primary
                isLoading={isCreating}
                onClick={(e) => {
                  e.preventDefault();
                  handleAddMember();
                }}
              >
                Add
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setShowAddMember(false);
                  setSelectedMemberId("");
                  setSelectedMemberLabel("");
                  setMemberSearchTerm("");
                  setMemberSearchResults([]);
                }}
              >
                Cancel
              </Button>
            </div>
          )}

          {isFetchingMemberships ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-md bg-gray-100"
                />
              ))}
            </div>
          ) : contributorMembershipsList.length === 0 ? (
            <p className="rounded-md border border-dashed border-gray-200 bg-gray-50/60 px-4 py-3 text-[12px] text-gray-500">
              No members have been added to this group yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {contributorMembershipsList.map(
                (membership: ContributorMembership) => {
                  const member = membership.memberContributor;
                  return (
                    <div
                      key={membership.id}
                      className="flex items-center justify-between gap-3 rounded-md border border-gray-100 bg-gray-50/80 p-3"
                    >
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[13px] font-medium text-gray-900">
                          {member?.displayName ||
                            member?.name ||
                            "Unknown contributor"}
                        </p>
                        {member?.email && (
                          <p className="text-[11px] text-gray-500">
                            {member.email}
                          </p>
                        )}
                        {member?.type && (
                          <span className="text-[10px] uppercase tracking-wider text-gray-400">
                            {member.type}
                          </span>
                        )}
                      </div>
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(
                            setSelectedContributorMembership(membership),
                          );
                          dispatch(setDeleteContributorMembershipModal(true));
                        }}
                        className="text-[12px] cursor-pointer text-red-700"
                      />
                    </div>
                  );
                },
              )}
            </div>
          )}
        </section>

        <footer className="flex w-full items-center justify-between gap-3">
          <Button
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            Back
          </Button>
        </footer>
      </main>
      <DeleteContributorMembership />
    </UserLayout>
  );
};

export default ContributorMembershipsPage;
