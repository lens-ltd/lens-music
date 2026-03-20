import Button from "@/components/inputs/Button";
import Combobox from "@/components/inputs/Combobox";
import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { useGetContributor } from "@/hooks/contributors/contributor.hooks";
import { useFetchContributorMemberships } from "@/hooks/contributors/contributorMembership.hooks";
import { useCreateContributorMembershipMutation } from "@/state/api/apiMutationSlice";
import { useLazyFetchContributorsQuery } from "@/state/api/apiQuerySlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import {
  Contributor,
  ContributorMembership,
} from "@/types/models/contributor.types";
import { UUID } from "@/types/common.types";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  setDeleteContributorMembershipModal,
  setSelectedContributorMembership,
} from "@/state/features/contributorMembershipSlice";
import DeleteContributorMembership from "./DeleteContributorMembership";

const ContributorMembershipsPage = () => {
  // NAVIGATION
  const navigate = useNavigate();
  const { id } = useParams<{ id: UUID }>();

  // STATE
  const dispatch = useAppDispatch();
  const { contributor } = useAppSelector((state) => state.contributor);
  const { contributorMembershipsList, deleteContributorMembershipModal } = useAppSelector(
    (state) => state.contributorMembership,
  );
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");

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
  }, [fetchContributorMemberships, page, size, id, deleteContributorMembershipModal]);

  // FETCH AVAILABLE CONTRIBUTORS FOR ADDING
  const [fetchContributors, { data: contributorsData }] =
    useLazyFetchContributorsQuery();

  useEffect(() => {
    if (showAddMember) {
      fetchContributors({ page: 0, size: 100 });
    }
  }, [showAddMember, fetchContributors]);

  const existingMemberIds = new Set(
    contributorMembershipsList.map((m) => m.memberContributorId),
  );
  const availableContributors = (
    (contributorsData?.data?.rows as Contributor[]) || []
  )
    .filter((c) => c.id !== id && !existingMemberIds.has(c.id))
    .map((c) => ({
      label: c.displayName || c.name || "",
      value: c.id,
    }));

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
                <Combobox
                  label="Select contributor"
                  placeholder="Search for a contributor to add"
                  value={selectedMemberId}
                  onChange={setSelectedMemberId}
                  options={availableContributors}
                />
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
              navigate(`/contributors/${id}`);
            }}
          >
            Back to details
          </Button>
        </footer>
      </main>
      <DeleteContributorMembership />
    </UserLayout>
  );
};

export default ContributorMembershipsPage;
