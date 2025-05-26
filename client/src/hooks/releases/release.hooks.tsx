export const useGetYearsList = () => {
  const years = [];
  for (let i = new Date().getFullYear(); i >= 1950; i--) {
    years.push(i);
  }

  return years;
};
