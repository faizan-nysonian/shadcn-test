"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-canvas-border outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-primary-border focus-visible:ring-0 focus-visible:ring-primary-border/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-alert-border aria-invalid:ring-0 aria-invalid:ring-alert-border/20 aria-invalid:aria-checked:border-primary-solid dark:bg-canvas-bg/30 dark:aria-invalid:border-alert-border/50 dark:aria-invalid:ring-alert-border/40 data-checked:border-primary-solid data-checked:bg-primary-solid data-checked:text-primary-on-primary dark:data-checked:bg-primary-solid",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-4 items-center justify-center"
      >
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-on-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
