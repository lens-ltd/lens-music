import { createContext, useContext } from 'react';

/**
 * The DOM node of the open dialog, if any. Floating menus (popover, select)
 * portal into it so they stay inside the dialog's focus trap: otherwise the
 * trap pulls focus back and inputs inside the menu can't be typed into.
 */
export const DialogContainerContext = createContext<HTMLElement | null>(null);

export const useDialogContainer = () => useContext(DialogContainerContext) ?? undefined;
