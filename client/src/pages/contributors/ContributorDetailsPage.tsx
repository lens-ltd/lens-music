import Button from "@/components/inputs/Button";
import { BackButton } from "@/components/layout/PageFooter";
import { KeyValueList, KeyValuePair } from "@/components/inputs/KeyValuePair";
import SectionCard from "@/components/layout/SectionCard";
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
import { formatPhone } from "@/utils/phone.helper";

const statusBadgeClassNames: Record<string, string> = {
  ACTIVE: "bg-(--success-soft) text-(--success)",
  INACTIVE: "bg-(--surface) text-(--muted)",
  VERIFIED: "bg-(--signal-soft) text-(--signal)",
  PENDING: "bg-(--surface) text-(--ink)",
  NOT_VERIFIED: "bg-(--danger-soft) text-(--danger)",
};

type FieldConfig = {
  keyText: string;
  label?: string;
  valueText?: string;
};

const getBadgeClassName = (status?: string) => {
  if (!status) {
    return "bg-(--surface) text-(--muted)";
  }

  return (
    statusBadgeClassNames[status] ||
    "bg-(--surface) text-(--muted)"
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
        valueText: contributorDetails?.displayName,
      },
      {
        keyText: "Full name",
        valueText: contributorDetails?.name,
      },
      {
        keyText: "Email",
        valueText: contributorDetails?.email,
      },
      {
        keyText: "Phone number",
        valueText: formatPhone(contributorDetails?.phoneNumber),
      },
      {
        keyText: "Country",
        valueText: contributorDetails?.country
          ? getCountryName(contributorDetails.country)
          : undefined,
      },
      {
        keyText: "Gender",
        valueText: contributorDetails?.gender
          ? capitalizeString(getGenderLabel(contributorDetails?.gender))
          : undefined,
      },
      {
        keyText: "dateOfBirth",
        label: "Date of birth",
        valueText: contributorDetails?.dateOfBirth
          ? `${contributorDetails.dateOfBirth}`
          : undefined,
      },
      {
        keyText: "Status",
        valueText: contributorDetails?.status
          ? capitalizeString(contributorDetails.status)
          : undefined,
      },
      {
        keyText: "Verification status",
        valueText: contributorDetails?.verificationStatus
          ? capitalizeString(contributorDetails.verificationStatus)
          : undefined,
      },
      {
        keyText: "Type",
        valueText: contributorDetails?.type
          ? capitalizeString(contributorDetails.type)
          : undefined,
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
      <SectionCard title={title} description={description}>
        {isFetching ? (
          <KeyValueList>
            {fields.map((field) => (
              <KeyValuePair
                key={field.keyText}
                keyText={field.keyText}
                isLoading
              />
            ))}
          </KeyValueList>
        ) : hasValues ? (
          <KeyValueList>
            {fields
              .filter((field) => field.valueText)
              .map((field) => (
                <KeyValuePair
                  key={field.keyText}
                  keyText={field.keyText}
                  valueText={field.valueText}
                />
              ))}
          </KeyValueList>
        ) : (
          <p className="rounded-(--radius-control) bg-(--surface) px-4 py-3 text-[13px] text-(--muted)">
            {emptyState}
          </p>
        )}
      </SectionCard>
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
            <p className="mt-2 text-[13px] text-(--muted)">
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
          <section className="card-framed p-8 text-center">
            <Heading type="h3" className="!text-(--ink)">
              Contributor not found
            </Heading>
            <p className="mt-2 text-[13px] text-(--muted)">
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
            <section className="card-framed p-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-(--muted)">
                    Contributor overview
                  </p>
                  <h2 className="mt-2 text-lg text-(--ink)">
                    {isFetching
                      ? "Loading contributor..."
                      : contributorDetails?.displayName ||
                        contributorDetails?.name ||
                        "Contributor details"}
                  </h2>
                  {!isFetching && (
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-(--muted)">
                      {contributorDetails?.email && (
                        <span className="text-(--signal) text-[13px]">
                          {contributorDetails?.email}
                        </span>
                      )}
                      {contributorDetails?.phoneNumber && (
                        <span className="text-(--signal) text-[13px]">
                          {formatPhone(contributorDetails?.phoneNumber)}
                        </span>
                      )}
                      {!contributorDetails?.email &&
                        !contributorDetails?.phoneNumber && (
                          <span className="text-[13px] text-(--muted)">
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
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-normal ${getBadgeClassName(
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

            <SectionCard
              title="Personal information"
              description="Supported contributor identity, contact, and lifecycle fields."
            >
              <KeyValueList>
                {personalInformation.map((field) => (
                  <KeyValuePair
                    key={field.keyText}
                    keyText={field.keyText}
                    label={field.label}
                    valueText={field.valueText}
                    isLoading={isFetching}
                  />
                ))}
              </KeyValueList>
            </SectionCard>

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
                <SectionCard
                  title="Members"
                  description="This contributor is a group. You can manage its members."
                >
                  <Button primary route={`/contributors/${id}/memberships`}>
                    Manage members
                  </Button>
                </SectionCard>
              )}

            {canAssignManagers && (
              <SectionCard
                title="Managers"
                description="Users assigned to manage this contributor. Assignment is admin-only; managers also need contributor permissions."
                action={
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
                }
                bodyClassName="flex flex-col gap-2"
              >
                  {managersIsFetching ? (
                    <p className="text-[13px] text-(--muted)">Loading managers…</p>
                  ) : managersList.length === 0 ? (
                    <p className="rounded-(--radius-control) bg-(--surface) px-4 py-3 text-[13px] text-(--muted)">
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
                          <p className="text-[13px] font-normal text-(--ink)">
                            {manager.user?.name || "User"}
                          </p>
                          <p className="truncate text-[13px] text-(--muted)">
                            {manager.user?.email || manager.userId}
                          </p>
                          <p className="mt-1 text-xs text-(--muted)">
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
              </SectionCard>
            )}

            {membershipsIsSuccess && contributorMembershipsList.length > 0 && (
              <SectionCard title="Group memberships" description="Groups this contributor is a member of.">
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
              </SectionCard>
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
