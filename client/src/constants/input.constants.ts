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

/** Row "more actions" trigger in tables: a filled pill, tinted blue on hover, focus and while its menu is open. */
export const ellipsisHClassName = `inline-flex h-7 min-w-10 shrink-0 cursor-pointer items-center justify-center rounded-(--radius-control) bg-(--surface) px-3 text-(--ink) transition-[background-color,color,transform] duration-(--dur-state) hover:bg-(--signal-soft) hover:text-(--signal) active:scale-[.96] focus-visible:bg-(--signal-soft) focus-visible:text-(--signal) data-[state=open]:bg-(--signal-soft) data-[state=open]:text-(--signal) [&_svg]:size-[18px]`;

/** An item inside a table row's action menu. */
export const tableActionClassName = `flex h-9 w-full items-center gap-2 rounded-(--radius-control) px-2 text-sm text-(--ink) hover:bg-(--surface) [&_svg]:size-4 [&_svg]:text-(--muted)`;

/** Shared chrome for every floating menu: select, combobox, popover, command. */
export const menuContentClassName = `rounded-(--radius-control) bg-(--paper) p-1 text-(--ink) shadow-(--shadow-menu)`;

/** Shared option row for every menu. Highlighted = surface, selected = signal-soft. */
const menuItemBaseClassName = `relative flex h-9 w-full cursor-pointer select-none items-center gap-2 rounded-(--radius-control) px-2 text-sm text-(--ink) outline-hidden`;

/** Radix Select items: `data-disabled` is present only when disabled. */
export const menuItemClassName = `${menuItemBaseClassName} data-highlighted:bg-(--surface) data-[state=checked]:bg-(--signal-soft) data-disabled:pointer-events-none data-disabled:opacity-50`;

/** cmdk items: `data-disabled` and `data-selected` are always set to "true" or "false". */
export const commandItemClassName = `${menuItemBaseClassName} data-[selected=true]:bg-(--surface) data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50`;

/** Icon-only ghost button, e.g. edit or delete inside a list row. Always pair with an aria-label. */
export const iconButtonClassName = `inline-grid size-(--control-sm) shrink-0 cursor-pointer place-items-center rounded-(--radius-control) text-(--muted) transition-colors duration-(--dur-state) hover:bg-(--surface) hover:text-(--ink) disabled:cursor-not-allowed disabled:opacity-45`;

/** Destructive variant of iconButtonClassName. */
export const iconButtonDangerClassName = `${iconButtonClassName} hover:bg-(--danger-soft) hover:text-(--danger)`;
