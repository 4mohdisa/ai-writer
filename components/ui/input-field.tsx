"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
  hint?: string
  icon?: React.ReactNode
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, label, error, required, hint, icon, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-1 text-sm font-medium text-foreground">
          {label}
          {required && (
            <span className="text-primary text-xs">*</span>
          )}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            className={cn(
              "flex h-11 w-full rounded-xl border bg-background px-4 py-2 text-sm transition-all duration-200",
              "placeholder:text-muted-foreground/60",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
              "hover:border-primary/50",
              error 
                ? "border-destructive focus:ring-destructive/20 focus:border-destructive" 
                : "border-input",
              icon && "pl-10",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {hint && !error && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
        {error && (
          <p className="text-sm text-destructive flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)
InputField.displayName = "InputField"

export { InputField }
