"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "primary"
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", variant = "default", ...props }, ref) => {
    const sizes = {
      sm: "h-4 w-4 border-2",
      md: "h-6 w-6 border-2", 
      lg: "h-8 w-8 border-[3px]"
    }

    const variants = {
      default: "border-muted-foreground/20 border-t-muted-foreground",
      primary: "border-primary/20 border-t-primary"
    }

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center", className)}
        {...props}
      >
        <div
          className={cn(
            "rounded-full animate-spin",
            sizes[size],
            variants[variant]
          )}
        />
      </div>
    )
  }
)
Spinner.displayName = "Spinner"

export { Spinner }
