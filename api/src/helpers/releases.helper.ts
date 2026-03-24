import { generateRandomNumber } from "./strings.helper";

export const generateCatalogNumber = (length: number = 6, productionYear: number = new Date().getFullYear()) => {
    return `LNS${productionYear}${generateRandomNumber(length)}`;
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
