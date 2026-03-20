export const getProductionYearOptions = (length: number = 100): { label: string; value: string }[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length }, (_, i) => currentYear - i).map((year) => ({
    label: year.toString(),
    value: year.toString(),
  }));
};