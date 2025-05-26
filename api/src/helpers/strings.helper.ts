export const generateRandomNumber = (length: number) => {
  return Math.floor(Math.random() * Math.pow(10, length));
}

export const generateCatalogNumber = (productionYear: number) => {
  return `LENS-${productionYear}-${generateRandomNumber(6)}`;
};
