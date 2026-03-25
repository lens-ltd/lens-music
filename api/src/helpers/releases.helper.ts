import { generateRandomNumber } from "./strings.helper";
import { ReleaseType, RELEASE_TYPE_TRACK_LIMITS } from "../constants/release.constants";

export const generateCatalogNumber = (length: number = 6, productionYear: number = new Date().getFullYear()) => {
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
