import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import { cn } from "@/lib/utils"
import { DialogContainerContext } from "./dialog-context"

import { LuX } from 'react-icons/lu';

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-(--overlay) data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const isPortaledFloatingLayer = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      '[data-radix-popper-content-wrapper], [data-radix-select-content], [data-combobox-menu]',
    ),
  );
};

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, onPointerDownOutside, onFocusOutside, onInteractOutside, ...props }, ref) => {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null)
  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      setContainer(node)
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  return (
  <DialogPortal>
    <DialogOverlay />
    {/* Centered with flexbox, not a transform: a transformed ancestor would
        clip the fixed-position menus that portal into the dialog. */}
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
    <DialogPrimitive.Content
      ref={setRefs}
      onPointerDownOutside={(event) => {
        // Combobox, date picker, and select menus portal to document.body, so
        // they read as "outside" the dialog. Interacting with them must not
        // dismiss the modal or yank focus back to the dialog chrome.
        if (isPortaledFloatingLayer(event.target)) {
          event.preventDefault();
        }
        onPointerDownOutside?.(event);
      }}
      onFocusOutside={(event) => {
        if (isPortaledFloatingLayer(event.target)) {
          event.preventDefault();
        }
        onFocusOutside?.(event);
      }}
      onInteractOutside={(event) => {
        if (isPortaledFloatingLayer(event.target)) {
          event.preventDefault();
        }
        onInteractOutside?.(event);
      }}
      className={cn(
        "pointer-events-auto relative grid w-full max-w-lg gap-5 rounded-(--radius-card) bg-(--paper) p-6 text-(--ink) shadow-(--shadow-modal) duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    >
      <DialogContainerContext.Provider value={container}>
        {children}
      </DialogContainerContext.Provider>
      <DialogPrimitive.Close className="absolute right-4 top-4 grid size-(--control-sm) cursor-pointer place-items-center rounded-(--radius-control) text-(--muted) transition-colors hover:bg-(--surface) hover:text-(--ink) disabled:pointer-events-none">
        <LuX className="size-4" aria-hidden="true" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
    </div>
  </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-medium leading-snug text-(--ink)",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("type-body-sm text-(--muted)", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
