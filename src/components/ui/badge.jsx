import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-100 text-brand-800",
        secondary:
          "border-transparent bg-surface-100 text-surface-700",
        destructive:
          "border-transparent bg-red-100 text-red-700",
        outline: "border-surface-300",
        success:
          "border-transparent bg-emerald-100 text-emerald-700",
        warning:
          "border-transparent bg-amber-100 text-amber-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} style={{ color: "inherit" }} {...props} />
  )
}

export { Badge, badgeVariants }
