import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-600/20 text-brand-400",
        secondary:
          "border-transparent bg-surface-200 text-surface-700",
        destructive:
          "border-transparent bg-red-600/20 text-red-400",
        outline: "border-surface-300",
        success:
          "border-transparent bg-emerald-600/20 text-emerald-400",
        warning:
          "border-transparent bg-amber-600/20 text-amber-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
