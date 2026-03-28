import { generateRandomNumber } from "./strings.helper";
import { ReleaseType, RELEASE_TYPE_TRACK_LIMITS } from "../constants/release.constants";
import { countriesList } from "../constants/location.constant";

export const generateCatalogNumber = (length: number = 6, prefix: string = 'LNS', productionYear: number = new Date().getFullYear()) => {
    return `LNS${productionYear}${generateRandomNumber(length)}`;
};

/**
 * ISO 639-1 language codes (subset of most common codes used in music distribution).
 */
const ISO_639_1_CODES = new Set([
    'aa', 'ab', 'af', 'ak', 'am', 'an', 'ar', 'as', 'av', 'ay', 'az',
    'ba', 'be', 'bg', 'bh', 'bi', 'bm', 'bn', 'bo', 'br', 'bs',
    'ca', 'ce', 'ch', 'co', 'cr', 'cs', 'cu', 'cv', 'cy',
    'da', 'de', 'dv', 'dz',
    'ee', 'el', 'en', 'eo', 'es', 'et', 'eu',
    'fa', 'ff', 'fi', 'fj', 'fo', 'fr', 'fy',
    'ga', 'gd', 'gl', 'gn', 'gu', 'gv',
    'ha', 'he', 'hi', 'ho', 'hr', 'ht', 'hu', 'hy', 'hz',
    'ia', 'id', 'ie', 'ig', 'ii', 'ik', 'in', 'io', 'is', 'it', 'iu',
    'ja', 'jv',
    'ka', 'kg', 'ki', 'kj', 'kk', 'kl', 'km', 'kn', 'ko', 'kr', 'ks', 'ku', 'kv', 'kw', 'ky',
    'la', 'lb', 'lg', 'li', 'ln', 'lo', 'lt', 'lu', 'lv',
    'mg', 'mh', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my',
    'na', 'nb', 'nd', 'ne', 'ng', 'nl', 'nn', 'no', 'nr', 'nv', 'ny',
    'oc', 'oj', 'om', 'or', 'os',
    'pa', 'pi', 'pl', 'ps', 'pt',
    'qu',
    'rm', 'rn', 'ro', 'ru', 'rw',
    'sa', 'sc', 'sd', 'se', 'sg', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'ss', 'st', 'su', 'sv', 'sw',
    'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tn', 'to', 'tr', 'ts', 'tt', 'tw', 'ty',
    'ug', 'uk', 'ur', 'uz',
    've', 'vi', 'vo',
    'wa', 'wo',
    'xh',
    'yi', 'yo',
    'za', 'zh', 'zu',
]);

export const isValidIso639Language = (code: string): boolean => {
    return ISO_639_1_CODES.has(code.toLowerCase().trim());
};

export const getTrackCountRange = (releaseType: ReleaseType): { min: number; max: number } => {
    return RELEASE_TYPE_TRACK_LIMITS[releaseType] ?? { min: 1, max: Infinity };
};

/**
 * Validates a UPC (Universal Product Code).
 *
 * A valid UPC is a 12- or 13-digit numeric code commonly used to identify products.
 *
 * Example of a valid 12-digit UPC: "012345678905"
 *
 * @param upc - The UPC string to validate
 * @returns True if valid, else false
 */
export const isValidUpc = (upc: string): boolean => {
    if (!/^\d{12,13}$/.test(upc)) {
        return false;
    }

    const digits = upc.split("").map(Number);
    const checkDigit = digits.pop();

    if (checkDigit === undefined) {
        return false;
    }

    const sum = digits
        .slice()
        .reverse()
        .reduce((total, digit, index) => {
            return total + digit * (index % 2 === 0 ? 3 : 1);
        }, 0);

    const computedCheckDigit = (10 - (sum % 10)) % 10;

    return computedCheckDigit === checkDigit;
};

const ISO_3166_ALPHA_2 = new Set(
    countriesList.map((country) => country.code.toUpperCase().trim()),
);

export const isValidIso3166Alpha2 = (code: string): boolean => {
    return ISO_3166_ALPHA_2.has(code.toUpperCase().trim());
};

export const isValidGRid = (grid: string): boolean => {
    return /^[A-Za-z0-9]{18}$/.test(grid.trim());
};

export const isValidIswc = (iswc: string): boolean => {
    return /^T-\d{9}-\d$/.test(iswc.trim().toUpperCase());
};

export const normalizeIsni = (isni: string): string => {
    return isni.replace(/[\s-]/g, "").trim();
};

export const isValidIsni = (isni: string): boolean => {
    return /^\d{16}$/.test(normalizeIsni(isni));
};

/** DDEX display order: lower sequence first; missing sequence sorts after explicit values. */
export const sortContributorsForDisplay = <
    T extends { sequenceNumber?: number | null; createdAt: Date | string },
>(
    items: T[],
): T[] => {
    return [...items].sort((a, b) => {
        const sa = a.sequenceNumber ?? Number.MAX_SAFE_INTEGER;
        const sb = b.sequenceNumber ?? Number.MAX_SAFE_INTEGER;
        if (sa !== sb) {
            return sa - sb;
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
};
