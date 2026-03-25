import { genderOptions } from "@/constants/input.constants";
import {
    Contributor,
    ContributorProfileLinkType,
    ContributorType,
    ContributorVerificationStatus,
    CreateContributorPayload,
    UserStatus,
} from "@/types/models/contributor.types";
import { capitalizeString } from "@/utils/strings.helper";

export type ContributorFormValues = {
    name: string;
    displayName?: string;
    email?: string;
    phoneNumber?: string;
    country?: string;
    gender?: string;
    dateOfBirth?: Date | string;
    status?: UserStatus;
    verificationStatus?: ContributorVerificationStatus;
    type?: ContributorType;
    ipn?: string;
    ipi?: string;
    isni?: string;
    parentContributorId?: string;
    homepage?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    spotify?: string;
    appleMusic?: string;
    deezer?: string;
    tidal?: string;
    amazonMusic?: string;
    soundcloud?: string;
    googleMusic?: string;
};

export const socialProfileFields = [
    { name: "homepage", label: "Homepage", type: ContributorProfileLinkType.WEBSITE, placeholder: "https://example.com" },
    { name: "facebook", label: "Facebook", type: ContributorProfileLinkType.FACEBOOK, placeholder: "https://facebook.com/artist" },
    { name: "instagram", label: "Instagram", type: ContributorProfileLinkType.INSTAGRAM, placeholder: "https://instagram.com/artist" },
    { name: "tiktok", label: "TikTok", type: ContributorProfileLinkType.TIKTOK, placeholder: "https://tiktok.com/@artist" },
    { name: "twitter", label: "Twitter", type: ContributorProfileLinkType.TWITTER, placeholder: "https://x.com/artist" },
    { name: "youtube", label: "YouTube", type: ContributorProfileLinkType.YOUTUBE, placeholder: "https://youtube.com/@artist" },
] as const;

export const storeProfileFields = [
    { name: "amazonMusic", label: "Amazon Music", type: ContributorProfileLinkType.AMAZON_MUSIC, placeholder: "Store ID or profile URL" },
    { name: "appleMusic", label: "Apple Music / iTunes", type: ContributorProfileLinkType.APPLE_MUSIC, placeholder: "Store ID or profile URL" },
    { name: "deezer", label: "Deezer", type: ContributorProfileLinkType.DEEZER, placeholder: "Store ID or profile URL" },
    { name: "googleMusic", label: "Google Music", type: ContributorProfileLinkType.GOOGLE_MUSIC, placeholder: "Store ID or profile URL" },
    { name: "soundcloud", label: "SoundCloud", type: ContributorProfileLinkType.SOUNDCLOUD, placeholder: "Store ID or profile URL" },
    { name: "spotify", label: "Spotify", type: ContributorProfileLinkType.SPOTIFY, placeholder: "Store ID or profile URL" },
    { name: "tidal", label: "Tidal", type: ContributorProfileLinkType.TIDAL, placeholder: "Store ID or profile URL" },
] as const;

export const statusOptions = Object.values(UserStatus).map((value) => ({
    label: capitalizeString(value),
    value,
}));

export const verificationStatusOptions = Object.values(ContributorVerificationStatus).map((value) => ({
    label: capitalizeString(value),
    value,
}));

export const contributorGenderOptions = genderOptions;

export const contributorTypeOptions = Object.values(ContributorType).map((value) => ({
    label: capitalizeString(value),
    value,
}));

export const GROUP_CONTRIBUTOR_TYPES = [
    ContributorType.GROUP,
    ContributorType.ORCHESTRA,
    ContributorType.CHOIR,
];

const allProfileFields = [...socialProfileFields, ...storeProfileFields];

const normalizeValue = (value?: string | null) => {
    const trimmedValue = value?.trim();
    return trimmedValue ? trimmedValue : undefined;
};

const getProfileLinkFieldName = (type: ContributorProfileLinkType) => {
    const profileField = allProfileFields.find((field) => field.type === type);
    return profileField?.name;
};

export const buildContributorPayload = (
    formValues: ContributorFormValues,
): CreateContributorPayload => {
    const profileLinks = allProfileFields
        .map((field) => {
            const rawValue = formValues[field.name];
            const url = normalizeValue(rawValue);

            if (!url) {
                return undefined;
            }

            return {
                type: field.type,
                url,
            };
        })
        .filter((link): link is NonNullable<typeof link> => Boolean(link));

    const displayName = normalizeValue(formValues.displayName);
    const name = normalizeValue(formValues.name);
    const dateOfBirth =
        formValues.dateOfBirth instanceof Date
            ? formValues.dateOfBirth.toISOString().split("T")[0]
            : normalizeValue(formValues.dateOfBirth);

    return {
        name: displayName || name || "",
        displayName,
        email: normalizeValue(formValues.email),
        phoneNumber: normalizeValue(formValues.phoneNumber),
        country: normalizeValue(formValues.country),
        gender: normalizeValue(formValues.gender),
        dateOfBirth,
        status: formValues.status,
        verificationStatus: formValues.verificationStatus,
        profileLinks: profileLinks.length ? profileLinks : undefined,
        type: formValues.type,
        ipn: normalizeValue(formValues.ipn),
        ipi: normalizeValue(formValues.ipi),
        isni: normalizeValue(formValues.isni),
        parentContributorId: normalizeValue(formValues.parentContributorId),
    };
};

export const getContributorFormDefaults = (
    contributor?: Contributor,
): ContributorFormValues => {
    const formDefaults: ContributorFormValues = {
        name: contributor?.name || "",
        displayName: contributor?.displayName || "",
        email: contributor?.email || "",
        phoneNumber: contributor?.phoneNumber || "",
        country: contributor?.country || "",
        gender: contributor?.gender || "",
        dateOfBirth: contributor?.dateOfBirth ? new Date(contributor.dateOfBirth) : undefined,
        status: contributor?.status || UserStatus.ACTIVE,
        verificationStatus:
            contributor?.verificationStatus || ContributorVerificationStatus.NOT_VERIFIED,
        type: contributor?.type || ContributorType.INDIVIDUAL,
        ipn: contributor?.ipn || "",
        ipi: contributor?.ipi || "",
        isni: contributor?.isni || "",
    };

    contributor?.profileLinks?.forEach((profileLink) => {
        const fieldName = getProfileLinkFieldName(profileLink.type);

        if (!fieldName) {
            return;
        }

        formDefaults[fieldName] = profileLink.url || "";
    });

    return formDefaults;
};
