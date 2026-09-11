import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-(--radius-control) border text-[13px] font-normal whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        default:
          "border-(--signal) bg-(--signal) text-white hover:border-(--signal-hover) hover:bg-(--signal-hover)",
        destructive:
          "border-(--danger) bg-(--danger) text-white hover:border-(--danger-strong) hover:bg-(--danger-strong)",
        outline:
          "border-(--menu-border) bg-white text-(--ink) hover:bg-(--surface)",
        secondary:
          "border-(--menu-border) bg-white text-(--ink) hover:bg-(--surface)",
        ghost:
          "border-transparent bg-transparent text-(--muted-weak) hover:bg-(--surface) hover:text-(--ink)",
        link: "border-transparent bg-transparent text-(--signal) p-0 h-auto link-sweep",
      },
      size: {
        default: "h-(--control-md) min-h-(--control-md) px-3.5",
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
