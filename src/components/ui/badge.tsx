import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-primary-border focus-visible:ring-[3px] focus-visible:ring-primary-border/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-alert-border aria-invalid:ring-alert-border/20 dark:aria-invalid:ring-alert-border/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary-solid text-primary-on-primary [a]:hover:bg-primary-solid/80",
        secondary:
          "bg-secondary-bg text-secondary-text [a]:hover:bg-secondary-bg/80",
        destructive:
          "bg-alert-bg text-alert-text focus-visible:ring-alert-border/20 dark:bg-alert-bg-hover dark:focus-visible:ring-alert-border/40 [a]:hover:bg-alert-bg-hover",
        outline:
          "border-canvas-border text-canvas-text-contrast [a]:hover:bg-canvas-bg [a]:hover:text-canvas-text",
        ghost:
          "hover:bg-canvas-bg hover:text-canvas-text dark:hover:bg-canvas-bg/50",
        link: "text-primary-text underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
