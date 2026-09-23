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

/** Row "more actions" trigger in tables: a ghost icon button. */
export const ellipsisHClassName = `inline-flex size-(--control-sm) cursor-pointer items-center justify-center rounded-(--radius-control) text-(--ink) transition-colors duration-(--dur-state) hover:bg-(--surface)`;

/** An item inside a table row's action menu. */
export const tableActionClassName = `flex h-9 w-full items-center gap-2 rounded-(--radius-control) px-2 text-sm text-(--ink) hover:bg-(--surface) [&_svg]:size-4 [&_svg]:text-(--muted)`;

/** Shared chrome for every floating menu: select, combobox, popover, command. */
export const menuContentClassName = `rounded-(--radius-control) bg-(--paper) p-1 text-(--ink) shadow-(--shadow-menu)`;

/** Shared option row for every menu. Highlighted = surface, selected = signal-soft. */
export const menuItemClassName = `relative flex h-9 w-full cursor-pointer select-none items-center gap-2 rounded-(--radius-control) px-2 text-sm outline-hidden data-highlighted:bg-(--surface) data-[selected=true]:bg-(--surface) aria-selected:bg-(--signal-soft) data-[state=checked]:bg-(--signal-soft) data-disabled:pointer-events-none data-disabled:opacity-50 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50`;

/** Icon-only ghost button, e.g. edit or delete inside a list row. Always pair with an aria-label. */
export const iconButtonClassName = `inline-grid size-(--control-sm) shrink-0 cursor-pointer place-items-center rounded-(--radius-control) text-(--muted) transition-colors duration-(--dur-state) hover:bg-(--surface) hover:text-(--ink) disabled:cursor-not-allowed disabled:opacity-45`;

/** Destructive variant of iconButtonClassName. */
export const iconButtonDangerClassName = `${iconButtonClassName} hover:bg-(--danger-soft) hover:text-(--danger)`;
