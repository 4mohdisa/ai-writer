"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { X, AlertCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react"

interface AlertBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "error" | "success" | "warning" | "info"
  title?: string
  onClose?: () => void
  action?: React.ReactNode
}

const AlertBanner = forwardRef<HTMLDivElement, AlertBannerProps>(
  ({ className, variant = "info", title, children, onClose, action, ...props }, ref) => {
    const variants = {
      error: "bg-destructive/10 border-destructive/20 text-destructive",
      success: "bg-green-500/10 border-green-500/20 text-green-700", 
      warning: "bg-amber-500/10 border-amber-500/20 text-amber-700",
      info: "bg-blue-500/10 border-blue-500/20 text-blue-700"
    }

    const icons = {
      error: AlertCircle,
      success: CheckCircle2,
      warning: AlertTriangle,
      info: Info
    }

    const Icon = icons[variant]

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border p-4 animate-fade-in",
          variants[variant],
          className
        )}
        role="alert"
        {...props}
      >
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="text-sm font-semibold">{title}</h4>
            )}
            {children && (
              <div className={cn("text-sm opacity-90", title && "mt-1")}>
                {children}
              </div>
            )}
            {action && (
              <div className="mt-3">
                {action}
              </div>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className={cn(
                "flex-shrink-0 rounded-lg p-1.5 transition-colors",
                "hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
              )}
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    )
  }
)
AlertBanner.displayName = "AlertBanner"

export { AlertBanner }
