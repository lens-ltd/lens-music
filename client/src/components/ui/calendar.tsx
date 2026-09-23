import * as React from "react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "size-7 bg-transparent p-0 opacity-70 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-(--muted) rounded-(--radius-control) w-8 font-normal type-meta",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center type-body-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-(--signal-soft) [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-(--signal) aria-selected:text-(--paper)",
        day_range_end:
          "day-range-end aria-selected:bg-(--signal) aria-selected:text-(--paper)",
        day_selected:
          "bg-(--signal) text-(--paper) hover:bg-(--signal-hover) hover:text-(--paper) focus:bg-(--signal) focus:text-(--paper)",
        day_today: "bg-(--signal-soft) text-(--ink)",
        day_outside:
          "day-outside text-(--placeholder) aria-selected:text-(--placeholder)",
        day_disabled: "text-(--placeholder) opacity-50",
        day_range_middle:
          "aria-selected:bg-(--signal-soft) aria-selected:text-(--ink)",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <LuChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <LuChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }
