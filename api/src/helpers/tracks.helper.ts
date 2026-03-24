export const normalizeIsrc = (isrc: string): string => {
    return isrc.replace(/[-\s]/g, "").toUpperCase();
};

export const isValidIsrc = (isrc: string): boolean => {
    return /^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$/.test(isrc);
};
