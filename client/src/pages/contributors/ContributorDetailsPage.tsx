import Button from "@/components/inputs/Button";
import { BackButton } from "@/components/layout/PageFooter";
import { KeyValuePair } from "@/components/inputs/KeyValuePair";
import TableActionButton from "@/components/inputs/TableActionButton";
import { Heading } from "@/components/text/Headings";
import { getCountryName } from "@/constants/countries.constants";
import { PERMISSIONS } from "@/constants/permission.constants";
import UserLayout from "@/containers/UserLayout";
import {
  useFetchContributorManagers,
  useGetContributor,
} from "@/hooks/contributors/contributor.hooks";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import {
  setAssignManagerModal,
  setSelectedManager,
  setUnassignManagerModal,
} from "@/state/features/contributorSlice";
import {
  Contributor,
  ContributorProfileLinkType,
  ContributorType,
  ContributorVerificationStatus,
} from "@/types/models/contributor.types";
import { GROUP_CONTRIBUTOR_TYPES } from "./contributorForm";
import { UUID } from "@/types/common.types";
import { capitalizeString, formatDate } from "@/utils/strings.helper";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { socialProfileFields, storeProfileFields } from "./contributorForm";
import { getGenderLabel } from "@/constants/input.constants";
import { useMemberContributorMembershipsColumns } from "@/hooks/contributors/columns.contributorMemberships";
import { useFetchContributorMemberships } from "@/hooks/contributors/contributorMembership.hooks";
import Table from "@/components/table/Table";
import AssignContributorManager from "./AssignContributorManager";
import UnassignContributorManager from "./UnassignContributorManager";
import { useRequestContributorVerificationMutation } from "@/state/api/apiMutationSlice";

import { LuBadgeCheck, LuPlus, LuSquarePen, LuTrash2 } from 'react-icons/lu';

const statusBadgeClassNames: Record<string, string> = {
  ACTIVE: "bg-(--success-soft) text-(--success) ring-1 ring-inset ring-(--success-soft)",
  INACTIVE: "bg-(--surface) text-(--muted) ring-1 ring-inset ring-(--line)",
  VERIFIED: "bg-(--signal-soft) text-(--signal) ring-1 ring-inset ring-primary/20",
  PENDING: "bg-(--surface) text-(--ink) ring-1 ring-inset ring-(--line)",
  NOT_VERIFIED: "bg-(--danger-soft) text-(--danger) ring-1 ring-inset ring-(--danger-soft)",
};

type FieldConfig = {
  keyText: string;
  valueText?: string;
};

const getBadgeClassName = (status?: string) => {
  if (!status) {
    return "bg-(--surface) text-(--muted) ring-1 ring-inset ring-(--line)";
  }

  return (
    statusBadgeClassNames[status] ||
    "bg-(--surface) text-(--muted) ring-1 ring-inset ring-(--line)"
  );
};

const getProfileLinkMap = (selectedContributor?: Contributor) => {
  return (
    selectedContributor?.profileLinks?.reduce<
      Partial<Record<ContributorProfileLinkType, string>>
    >((accumulator, profileLink) => {
      if (profileLink.url) {
        accumulator[profileLink.type] = profileLink.url;
      }

      return accumulator;
    }, {}) || {}
  );
};

const ContributorDetailsPage = () => {
  // STATE
  const dispatch = useAppDispatch();
  const { contributor, managersList, assignManagerModal, unassignManagerModal } =
    useAppSelector((state) => state.contributor);
  const { user: authUser } = useAppSelector((state) => state.auth);
  const hasRequestedContributor = useRef(false);
  const { contributorMembershipsList } = useAppSelector(
    (state) => state.contributorMembership,
  );

  const canAssignManagers = authUser?.permissions?.includes(
    PERMISSIONS.ASSIGN_CONTRIBUTOR_MANAGER,
  );

  const { memberContributorMembershipsColumns } = useMemberContributorMembershipsColumns();

  // FETCH MEMBERSHIPS
  const {
    fetchContributorMemberships,
    isFetching: membershipsIsFetching,
    isSuccess: membershipsIsSuccess,
    page: membershipsPage,
    size: membershipsSize,
    totalCount: membershipsTotalCount,
    totalPages: membershipsTotalPages,
    setPage: setMembershipsPage,
    setSize: setMembershipsSize,
  } = useFetchContributorMemberships();

  const {
    fetchManagers,
    isFetching: managersIsFetching,
  } = useFetchContributorManagers();

  useEffect(() => {
    if (contributor?.id) {
      fetchContributorMemberships({
        page: 0,
        size: 100,
        memberContributorId: contributor.id,
      });
    }
  }, [fetchContributorMemberships, contributor?.id]);

  // NAVIGATION
  const navigate = useNavigate();
  const { id } = useParams<{ id: UUID }>();

  // FETCH CONTRIBUTOR
  const { getContributor, isFetching, data, isSuccess } = useGetContributor();
  const [requestVerification, { isLoading: isRequestingVerification }] =
    useRequestContributorVerificationMutation();

  useEffect(() => {
    if (!id) {
      toast.error("Contributor ID is missing.");
      return;
    }

    hasRequestedContributor.current = true;
    getContributor({ id });
  }, [getContributor, id]);

  useEffect(() => {
    if (id && canAssignManagers && !assignManagerModal && !unassignManagerModal) {
      fetchManagers({ id });
    }
  }, [
    id,
    canAssignManagers,
    fetchManagers,
    assignManagerModal,
    unassignManagerModal,
  ]);

  const contributorDetails = useMemo(() => {
    if (contributor?.id === id) {
      return contributor;
    }

    const fetchedContributor = data?.data as Contributor | undefined;
    if (fetchedContributor?.id === id) {
      return fetchedContributor;
    }

    return undefined;
  }, [contributor, data?.data, id]);

  const canManage =
    Boolean(contributorDetails?.currentUserCanManage) ||
    Boolean(canAssignManagers);
  const canRequestVerification = Boolean(
    canManage &&
      contributorDetails &&
      [
        ContributorVerificationStatus.PENDING,
        ContributorVerificationStatus.NOT_VERIFIED,
      ].includes(contributorDetails.verificationStatus),
  );
  const verificationRequested =
    contributorDetails?.verificationStatus ===
    ContributorVerificationStatus.PENDING_VERIFICATION;

  const handleRequestVerification = async () => {
    if (!id || !canRequestVerification) return;
    try {
      const response = await requestVerification(id).unwrap();
      toast.success(response.message || "Verification requested successfully.");
      getContributor({ id });
    } catch (error) {
      toast.error(
        (error as { data?: { message?: string } })?.data?.message ||
          "Unable to request verification.",
      );
    }
  };

  const profileLinksMap = useMemo(
    () => getProfileLinkMap(contributorDetails),
    [contributorDetails],
  );

  const personalInformation = useMemo<FieldConfig[]>(
    () => [
      {
        keyText: "Display name",
        valueText: contributorDetails?.displayName || "Not provided",
      },
      {
        keyText: "Full name",
        valueText: contributorDetails?.name || "Not provided",
      },
      {
        keyText: "Email",
        valueText: contributorDetails?.email || "Not provided",
      },
      {
        keyText: "Phone number",
        valueText: contributorDetails?.phoneNumber || "Not provided",
      },
      {
        keyText: "Country",
        valueText: contributorDetails?.country
          ? getCountryName(contributorDetails.country)
          : "Not provided",
      },
      {
        keyText: "Gender",
        valueText: contributorDetails?.gender
          ? capitalizeString(getGenderLabel(contributorDetails?.gender))
          : "Not provided",
      },
      {
        keyText: "dateOfBirth",
        valueText: contributorDetails?.dateOfBirth
          ? `${contributorDetails.dateOfBirth}`
          : "Not provided",
      },
      {
        keyText: "Status",
        valueText: contributorDetails?.status
          ? capitalizeString(contributorDetails.status)
          : "Not provided",
      },
      {
        keyText: "Verification status",
        valueText: contributorDetails?.verificationStatus
          ? capitalizeString(contributorDetails.verificationStatus)
          : "Not provided",
      },
      {
        keyText: "Type",
        valueText: contributorDetails?.type
          ? capitalizeString(contributorDetails.type)
          : "Not provided",
      },
    ],
    [contributorDetails],
  );

  const socialProfiles = useMemo<FieldConfig[]>(
    () =>
      socialProfileFields.map((field) => ({
        keyText: field.label,
        valueText: profileLinksMap[field.type],
      })),
    [profileLinksMap],
  );

  const storeProfiles = useMemo<FieldConfig[]>(
    () =>
      storeProfileFields.map((field) => ({
        keyText: field.label,
        valueText: profileLinksMap[field.type],
      })),
    [profileLinksMap],
  );

  const hasFetchedContributor =
    isSuccess || (!isFetching && hasRequestedContributor.current);
  const isNotFound = !id || (hasFetchedContributor && !contributorDetails);

  const renderProfileSection = (
    title: string,
    description: string,
    fields: FieldConfig[],
    emptyState: string,
  ) => {
    const hasValues = fields.some((field) => field.valueText);

    return (
      <section className="rounded-(--radius-card) bg-(--paper)">
        <header className="flex flex-col gap-1">
          <Heading type="h3" className="!text-(--ink)">
            {title}
          </Heading>
          <p className="text-[12px] text-(--muted)">{description}</p>
        </header>

        {isFetching ? (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {fields.map((field) => (
              <KeyValuePair
                key={field.keyText}
                keyText={field.keyText}
                isLoading
              />
            ))}
          </div>
        ) : hasValues ? (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {fields
              .filter((field) => field.valueText)
              .map((field) => (
                <KeyValuePair
                  key={field.keyText}
                  keyText={field.keyText}
                  valueText={field.valueText}
                  className="h-full rounded-(--radius-control) bg-(--surface) p-3"
                />
              ))}
          </div>
        ) : (
          <p className="mt-4 rounded-(--radius-control) bg-(--surface) px-4 py-3 text-[12px] text-(--muted)">
            {emptyState}
          </p>
        )}
      </section>
    );
  };

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <Heading isLoading={isFetching}>
              {contributorDetails?.displayName ||
                contributorDetails?.name ||
                "Contributor details"}
            </Heading>
            <p className="mt-2 text-[12px] text-(--muted)">
              Review the contributor record, supported profile links, and
              current verification metadata.
            </p>
          </div>
          {canManage && (
            <div className="flex flex-wrap items-center gap-2">
              {(canRequestVerification || verificationRequested) && (
                <Button
                  icon={LuBadgeCheck}
                  primary={canRequestVerification}
                  disabled={verificationRequested || isRequestingVerification}
                  isLoading={isRequestingVerification}
                  onClick={(event) => {
                    event.preventDefault();
                    handleRequestVerification();
                  }}
                >
                  {verificationRequested
                    ? "Verification requested"
                    : "Request verification"}
                </Button>
              )}
              <Button
                icon={LuSquarePen}
                onClick={(event) => {
                  event.preventDefault();
                  navigate(`/contributors/${id}/update`);
                }}
              >
                Edit contributor
              </Button>
            </div>
          )}
        </header>

        {isNotFound ? (
          <section className="rounded-(--radius-card) bg-(--surface) p-8 text-center">
            <Heading type="h3" className="!text-(--ink)">
              Contributor not found
            </Heading>
            <p className="mt-2 text-[12px] text-(--muted)">
              The contributor record could not be loaded or does not exist.
            </p>
            <menu className="mt-5 flex justify-center">
              <BackButton
                onClick={(event) => {
                  event.preventDefault();
                  navigate(-1);
                }}
              >
                Back
              </BackButton>
            </menu>
          </section>
        ) : (
          <>
            <section className="rounded-(--radius-card) bg-(--paper)">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-(--muted)">
                    Contributor overview
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-(--ink)">
                    {isFetching
                      ? "Loading contributor..."
                      : contributorDetails?.displayName ||
                        contributorDetails?.name ||
                        "Contributor details"}
                  </h2>
                  {!isFetching && (
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-(--muted)">
                      {contributorDetails?.email && (
                        <span className="text-(--signal) text-[12px]">
                          {contributorDetails?.email}
                        </span>
                      )}
                      {contributorDetails?.phoneNumber && (
                        <span className="text-(--signal) text-[12px]">
                          {contributorDetails?.phoneNumber}
                        </span>
                      )}
                      {!contributorDetails?.email &&
                        !contributorDetails?.phoneNumber && (
                          <span className="text-[12px] text-(--muted)">
                            No direct contact details available.
                          </span>
                        )}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {isFetching ? (
                    <>
                      <span className="h-7 w-24 animate-pulse rounded-full bg-(--surface)" />
                      <span className="h-7 w-28 animate-pulse rounded-full bg-(--surface)" />
                    </>
                  ) : (
                    <>
                      {contributorDetails?.verificationStatus && (
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-normal ${getBadgeClassName(
                            contributorDetails.verificationStatus,
                          )}`}
                        >
                          {capitalizeString(
                            contributorDetails.verificationStatus,
                          )}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-(--radius-card) bg-(--paper)">
              <header className="flex flex-col gap-1">
                <Heading type="h3" className="!text-(--ink)">
                  Personal information
                </Heading>
                <p className="text-[12px] text-(--muted)">
                  Supported contributor identity, contact, and lifecycle fields.
                </p>
              </header>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                {personalInformation.map((field) => (
                  <KeyValuePair
                    key={field.keyText}
                    keyText={field.keyText}
                    valueText={field.valueText}
                    isLoading={isFetching}
                    className="h-full rounded-(--radius-control) bg-(--surface) p-3"
                  />
                ))}
              </div>
            </section>

            {renderProfileSection(
              "Social media",
              "Supported links are shown from the contributor profile references.",
              socialProfiles,
              "No social profiles added.",
            )}

            {renderProfileSection(
              "Store IDs",
              "Supported store identifiers and profile URLs for this contributor.",
              storeProfiles,
              "No store identifiers added.",
            )}

            {contributorDetails?.type &&
              GROUP_CONTRIBUTOR_TYPES.includes(
                contributorDetails.type as ContributorType,
              ) &&
              canManage && (
                <section className="rounded-(--radius-card) bg-(--paper)">
                  <header className="flex flex-col gap-1">
                    <Heading type="h3" className="!text-(--ink)">
                      Members
                    </Heading>
                    <p className="text-[12px] text-(--muted)">
                      This contributor is a group. You can manage its members.
                    </p>
                  </header>
                  <div className="mt-4">
                    <Button primary route={`/contributors/${id}/memberships`}>
                      Manage members
                    </Button>
                  </div>
                </section>
              )}

            {canAssignManagers && (
              <section className="rounded-(--radius-card) bg-(--paper)">
                <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <Heading type="h3" className="!text-(--ink)">
                      Managers
                    </Heading>
                    <p className="text-[12px] text-(--muted)">
                      Users assigned to manage this contributor. Assignment is
                      admin-only; managers also need contributor permissions.
                    </p>
                  </div>
                  <Button
                    primary
                    icon={LuPlus}
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(setAssignManagerModal(true));
                    }}
                  >
                    Assign manager
                  </Button>
                </header>
                <div className="mt-4 flex flex-col gap-2">
                  {managersIsFetching ? (
                    <p className="text-[12px] text-(--muted)">Loading managers…</p>
                  ) : managersList.length === 0 ? (
                    <p className="rounded-(--radius-control) bg-(--surface) px-4 py-3 text-[12px] text-(--muted)">
                      No managers assigned yet. The creator is auto-assigned on
                      create; assign additional users as needed.
                    </p>
                  ) : (
                    managersList.map((manager) => (
                      <div
                        key={manager.id}
                        className="flex flex-col gap-2 rounded-md bg-(--surface) p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-(--ink)">
                            {manager.user?.name || "User"}
                          </p>
                          <p className="truncate text-[12px] text-(--muted)">
                            {manager.user?.email || manager.userId}
                          </p>
                          <p className="mt-1 text-[11px] text-(--muted)">
                            Assigned{" "}
                            {manager.createdAt
                              ? formatDate(manager.createdAt, "DD/MM/YYYY HH:mm")
                              : "—"}
                          </p>
                        </div>
                        <TableActionButton
                          icon={LuTrash2}
                          iconClassName="text-(--danger)"
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(setSelectedManager(manager));
                            dispatch(setUnassignManagerModal(true));
                          }}
                        >
                          Remove
                        </TableActionButton>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {membershipsIsSuccess && contributorMembershipsList.length > 0 && (
              <section className="rounded-(--radius-card) bg-(--paper)">
                <header className="flex flex-col gap-1">
                  <Heading type="h3" className="!text-(--ink)">
                    This contributor is a member of the following groups:
                  </Heading>
                  <Table
                    data={contributorMembershipsList}
                    columns={memberContributorMembershipsColumns}
                    isLoading={membershipsIsFetching}
                    page={membershipsPage}
                    size={membershipsSize}
                    totalCount={membershipsTotalCount}
                    totalPages={membershipsTotalPages}
                    setPage={setMembershipsPage}
                    setSize={setMembershipsSize}
                  />
                </header>
              </section>
            )}
          </>
        )}
        <footer className="flex w-full items-center justify-between gap-3">
          <BackButton
            onClick={(event) => {
              event.preventDefault();
              navigate(-1);
            }}
          >
            Back
          </BackButton>
        </footer>
      </main>
      <AssignContributorManager />
      <UnassignContributorManager />
    </UserLayout>
  );
};

export default ContributorDetailsPage;
