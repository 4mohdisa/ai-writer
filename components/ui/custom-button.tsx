"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "destructive"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ 
    className, 
    variant = "primary", 
    size = "md",
    loading, 
    fullWidth, 
    icon,
    iconPosition = "left",
    children, 
    disabled, 
    ...props 
  }, ref) => {
    const baseClasses = "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
    
    const variants = {
      primary: "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
      ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
      outline: "border-2 border-border text-foreground hover:bg-muted hover:border-foreground/20",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft"
    }
    
    const sizes = {
      sm: "h-9 px-3 text-sm rounded-lg gap-1.5",
      md: "h-11 px-5 text-sm rounded-xl gap-2",
      lg: "h-13 px-7 text-base rounded-xl gap-2.5"
    }
    
    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <svg 
            className="animate-spin h-4 w-4 absolute left-1/2 -translate-x-1/2" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        <span className={cn("flex items-center gap-2", loading && "invisible")}>
          {icon && iconPosition === "left" && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </span>
      </button>
    )
  }
)
CustomButton.displayName = "CustomButton"

export { CustomButton }
