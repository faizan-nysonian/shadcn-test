import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-primary-border focus-visible:ring-3 focus-visible:ring-primary-border/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-alert-border aria-invalid:ring-3 aria-invalid:ring-alert-border/20 dark:aria-invalid:border-alert-border/50 dark:aria-invalid:ring-alert-border/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary-solid text-primary-on-primary [a]:hover:bg-primary-solid/80",
        outline:
          "border-canvas-border bg-canvas-base hover:bg-canvas-bg hover:text-canvas-text-contrast aria-expanded:bg-canvas-bg aria-expanded:text-canvas-text-contrast dark:border-canvas-border dark:bg-canvas-bg/30 dark:hover:bg-canvas-bg/50",
        secondary:
          "bg-secondary-bg text-secondary-text hover:bg-secondary-bg/80 aria-expanded:bg-secondary-bg aria-expanded:text-secondary-text",
        ghost:
          "hover:bg-canvas-bg hover:text-canvas-text-contrast aria-expanded:bg-canvas-bg aria-expanded:text-canvas-text-contrast dark:hover:bg-canvas-bg/50",
        destructive:
          "bg-alert-bg text-alert-text hover:bg-alert-bg-hover focus-visible:border-alert-border/40 focus-visible:ring-alert-border/20 dark:bg-alert-bg-hover dark:hover:bg-alert-bg-active dark:focus-visible:ring-alert-border/40",
        link: "text-primary-text underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
