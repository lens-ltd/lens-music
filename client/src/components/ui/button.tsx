import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Usage:
 * - primary: the one main action in a view
 * - secondary: other actions that sit beside the primary
 * - ghost: toolbars, table rows and icon-only buttons
 * - destructive: confirming a delete or removal, inside a dialog
 * - link: inline navigation
 */
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-(--radius-control) text-sm font-normal whitespace-nowrap transition-colors duration-(--dur-state) disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-(--signal) text-white hover:bg-(--signal-hover)",
        secondary: "border border-(--line-field) bg-(--paper) text-(--ink) hover:border-(--line-hover) hover:bg-(--surface)",
        ghost: "bg-transparent text-(--ink) hover:bg-(--surface)",
        destructive: "bg-(--danger) text-white hover:bg-(--danger-hover)",
        link: "h-auto! min-h-0! bg-transparent px-0! text-(--signal) link-sweep",
      },
      size: {
        lg: "h-(--control-lg) min-h-(--control-lg) px-6 text-base",
        md: "h-(--control-md) min-h-(--control-md) px-4",
        sm: "h-(--control-sm) min-h-(--control-sm) px-3 text-[13px]",
        icon: "size-(--control-md)",
        "icon-sm": "size-(--control-sm)",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
