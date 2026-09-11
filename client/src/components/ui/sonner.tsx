import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast rounded-md border border-(--menu-border) bg-(--paper) px-3.5 py-3 shadow-[var(--shadow-menu)] type-body-sm text-(--ink)",
          description: "group-[.toast]:type-meta",
          actionButton:
            "group-[.toast]:bg-(--signal) group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-(--surface) group-[.toast]:text-(--ink)",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
