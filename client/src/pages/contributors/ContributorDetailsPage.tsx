import Button from "@/components/inputs/Button";
import { KeyValuePair } from "@/components/inputs/KeyValuePair";
import { Heading } from "@/components/text/Headings";
import { getCountryName } from "@/constants/countries.constants";
import UserLayout from "@/containers/UserLayout";
import { useGetContributor } from "@/hooks/contributors/contributor.hooks";
import { useAppSelector } from "@/state/hooks";
import { Contributor, ContributorProfileLinkType } from "@/types/models/contributor.types";
import { UUID } from "@/types/common.types";
import { capitalizeString } from "@/utils/strings.helper";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
    socialProfileFields,
    storeProfileFields,
} from "./contributorForm";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getGenderLabel } from "@/constants/input.constants";

const statusBadgeClassNames: Record<string, string> = {
    ACTIVE: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200",
    INACTIVE: "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200",
    VERIFIED: "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20",
    PENDING: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
    NOT_VERIFIED: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
};

type FieldConfig = {
    keyText: string;
    valueText?: string;
};

const getBadgeClassName = (status?: string) => {
    if (!status) {
        return "bg-gray-100 text-gray-500 ring-1 ring-inset ring-gray-200";
    }

    return (
        statusBadgeClassNames[status] ||
        "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200"
    );
};

const getProfileLinkMap = (selectedContributor?: Contributor) => {
    return (
        selectedContributor?.profileLinks?.reduce<
            Partial<Record<ContributorProfileLinkType, string>>
        >(
            (accumulator, profileLink) => {
                if (profileLink.url) {
                    accumulator[profileLink.type] = profileLink.url;
                }

                return accumulator;
            },
            {},
        ) || {}
    );
};

const ContributorDetailsPage = () => {

    // STATE
    const { contributor } = useAppSelector((state) => state.contributor);
    const hasRequestedContributor = useRef(false);

    // NAVIGATION
    const navigate = useNavigate();
    const { id } = useParams<{ id: UUID }>();

    // FETCH CONTRIBUTOR
    const { getContributor, isFetching, data, isSuccess } = useGetContributor();

    useEffect(() => {
        if (!id) {
            toast.error("Contributor ID is missing.");
            return;
        }

        hasRequestedContributor.current = true;
        getContributor({ id });
    }, [getContributor, id]);

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
            <section className="rounded-md border border-gray-200/80 bg-white p-5 shadow-sm">
                <header className="flex flex-col gap-1">
                    <Heading type="h3" className="!text-gray-900">
                        {title}
                    </Heading>
                    <p className="text-[12px] text-gray-500">{description}</p>
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
                                    className="h-full border border-gray-100 bg-gray-50/80 p-3"
                                />
                            ))}
                    </div>
                ) : (
                    <p className="mt-4 rounded-md border border-dashed border-gray-200 bg-gray-50/60 px-4 py-3 text-[12px] text-gray-500">
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
                        <p className="mt-2 text-[12px] text-gray-500">
                            Review the contributor record, supported profile links,
                            and current verification metadata.
                        </p>
                    </div>
                    <FontAwesomeIcon icon={faPenToSquare} className="text-primary text-[14px] cursor-pointer" onClick={(event) => {
                        event.preventDefault();
                        navigate(`/contributors/${id}/update`);
                    }} />
                </header>

                {isNotFound ? (
                    <section className="rounded-md border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
                        <Heading type="h3" className="!text-gray-900">
                            Contributor not found
                        </Heading>
                        <p className="mt-2 text-[12px] text-gray-500">
                            The contributor record could not be loaded or does not
                            exist.
                        </p>
                        <menu className="mt-5 flex justify-center">
                            <Button
                                onClick={(event) => {
                                    event.preventDefault();
                                    navigate(-1);
                                }}
                            >
                                Back
                            </Button>
                        </menu>
                    </section>
                ) : (
                    <>
                        <section className="rounded-md border border-gray-200/80 bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0 flex-1">
                                    <p className="text-[11px] uppercase tracking-[0.2em] text-primary/70">
                                        Contributor overview
                                    </p>
                                    <h2 className="mt-2 text-lg font-semibold text-gray-900">
                                        {isFetching
                                            ? "Loading contributor..."
                                            : contributorDetails?.displayName ||
                                            contributorDetails?.name ||
                                            "Contributor details"}
                                    </h2>
                                    {!isFetching && (
                                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-gray-500">
                                            {contributorDetails?.email && (
                                                <span className="text-primary text-[12px]">{contributorDetails?.email}</span>
                                            )}
                                            {contributorDetails?.phoneNumber && (
                                                <span className="text-primary text-[12px]">{contributorDetails?.phoneNumber}</span>
                                            )}
                                            {!contributorDetails?.email &&
                                                !contributorDetails?.phoneNumber && (
                                                    <span className="text-[12px] text-gray-500">
                                                        No direct contact details available.
                                                    </span>
                                                )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    {isFetching ? (
                                        <>
                                            <span className="h-7 w-24 animate-pulse rounded-full bg-gray-100" />
                                            <span className="h-7 w-28 animate-pulse rounded-full bg-gray-100" />
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

                        <section className="rounded-md border border-gray-200/80 bg-white p-5 shadow-sm">
                            <header className="flex flex-col gap-1">
                                <Heading type="h3" className="!text-gray-900">
                                    Personal information
                                </Heading>
                                <p className="text-[12px] text-gray-500">
                                    Supported contributor identity, contact, and
                                    lifecycle fields.
                                </p>
                            </header>

                            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                                {personalInformation.map((field) => (
                                    <KeyValuePair
                                        key={field.keyText}
                                        keyText={field.keyText}
                                        valueText={field.valueText}
                                        isLoading={isFetching}
                                        className="h-full border border-gray-100 bg-gray-50/80 p-3"
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
                    </>
                )}
                <footer className="flex w-full items-center justify-between gap-3">
                    <Button
                        onClick={(event) => {
                            event.preventDefault();
                            navigate(-1);
                        }}
                    >
                        Back
                    </Button>
                </footer>
            </main>
        </UserLayout>
    );
};

export default ContributorDetailsPage;
