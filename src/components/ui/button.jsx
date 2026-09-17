import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "!bg-brand-600 text-white shadow-sm hover:!bg-brand-700 hover:shadow-glow-sm",
        destructive:
          "!bg-accent-rose text-white shadow-sm hover:bg-red-600",
        outline:
          "border border-surface-200 bg-white text-surface-700 hover:bg-surface-50 hover:border-surface-300",
        secondary:
          "bg-surface-100 text-surface-700 hover:bg-surface-200",
        ghost:
          "text-surface-600 hover:bg-surface-100 hover:text-surface-800",
        link: "text-brand-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = ({ className, variant, size, asChild = false, ...props }) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
