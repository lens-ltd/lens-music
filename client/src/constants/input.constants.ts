export const genderOptions = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
];

export const getGenderLabel = (gender?: string) => {
  if (!gender) return undefined;
  return genderOptions?.find(
    (g) => g?.value === gender || g.label.toLowerCase() === gender.toLowerCase()
  )?.label;
};

export const ellipsisHClassName = `text-(--ink) cursor-pointer type-body-sm transition-colors duration-200 bg-(--surface) hover:bg-(--surface-hover) rounded-(--radius-control) p-1.5 px-4`;

export const tableActionClassName = `w-full flex items-center gap-2 type-body-sm text-center p-1 px-2 rounded-(--radius-control) hover:bg-(--surface)`;
