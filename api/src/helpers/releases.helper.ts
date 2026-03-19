import { generateRandomNumber } from "./strings.helper";

export const generateCatalogNumber = (length: number = 6, productionYear: number = new Date().getFullYear()) => {
    return `LNS${productionYear}${generateRandomNumber(length)}`;
};