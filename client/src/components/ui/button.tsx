import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-(--radius-control) type-label transition-[background-color,color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0,0,1,1)] focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default:
          "border border-(--lens-blue) bg-(--lens-blue) text-(--lens-blue-ink) hover:bg-(--lens-blue-hover) hover:border-(--lens-blue-hover) active:shadow-[var(--press-on-ink)_999px_999px_0_inset]",
        destructive:
          "border border-(--danger) bg-(--danger) text-(--on-consequence) hover:bg-(--danger-strong)",
        outline:
          "border border-(--ink) bg-transparent text-(--ink) hover:bg-(--surface) active:shadow-[var(--press-on-paper)_999px_999px_0_inset]",
        secondary:
          "border border-transparent bg-(--surface) text-(--ink) hover:bg-(--surface-hover) active:shadow-[var(--press-on-paper)_999px_999px_0_inset]",
        ghost:
          "border-transparent bg-transparent text-(--ink) hover:bg-(--surface) active:shadow-[var(--press-on-paper)_999px_999px_0_inset]",
        link: "border-transparent bg-transparent text-(--lens-blue) p-0 h-auto link-sweep",
      },
      size: {
        default: "h-(--control-sm) min-h-(--control-sm) px-3.5",
        sm: "h-(--control-sm) min-h-(--control-sm) px-3",
        lg: "h-(--control-md) min-h-(--control-md) px-5",
        icon: "size-(--control-sm)",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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
