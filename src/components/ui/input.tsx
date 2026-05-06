import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-canvas-border bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-canvas-text-contrast placeholder:text-canvas-text focus-visible:border-primary-border focus-visible:ring-0 focus-visible:ring-primary-border/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-canvas-bg/50 disabled:opacity-50 aria-invalid:border-alert-border aria-invalid:ring-0 aria-invalid:ring-alert-border/20 md:text-sm dark:bg-canvas-bg/30 dark:disabled:bg-canvas-bg/80 dark:aria-invalid:border-alert-border/50 dark:aria-invalid:ring-alert-border/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
