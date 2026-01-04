"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface CustomCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  icon?: React.ReactNode
  variant?: "default" | "elevated" | "glass"
}

const CustomCard = forwardRef<HTMLDivElement, CustomCardProps>(
  ({ className, title, description, icon, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-card border border-border shadow-soft",
      elevated: "bg-card border border-border shadow-soft-lg hover:shadow-xl transition-shadow duration-300",
      glass: "glass shadow-soft-lg"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl overflow-hidden",
          variants[variant],
          className
        )}
        {...props}
      >
        {(title || description || icon) && (
          <div className="px-6 pt-6 pb-2">
            <div className="flex items-start gap-4">
              {icon && (
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {icon}
                </div>
              )}
              <div className="flex-1 min-w-0">
                {title && (
                  <h3 className="text-lg font-semibold text-foreground tracking-tight">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        <div className={cn("px-6 pb-6", (title || description || icon) ? "pt-4" : "pt-6")}>
          {children}
        </div>
      </div>
    )
  }
)
CustomCard.displayName = "CustomCard"

export { CustomCard }
