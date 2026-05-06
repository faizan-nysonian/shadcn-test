import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-canvas-border bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-canvas-text focus-visible:border-primary-border focus-visible:ring-0 focus-visible:ring-primary-border/50 disabled:cursor-not-allowed disabled:bg-canvas-bg/50 disabled:opacity-50 aria-invalid:border-alert-border aria-invalid:ring-0 aria-invalid:ring-alert-border/20 md:text-sm dark:bg-canvas-bg/30 dark:disabled:bg-canvas-bg/80 dark:aria-invalid:border-alert-border/50 dark:aria-invalid:ring-alert-border/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
