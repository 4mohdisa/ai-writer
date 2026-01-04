"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  required?: boolean
  showCounter?: boolean
  maxLength?: number
  hint?: string
}

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ className, label, error, required, showCounter, maxLength, hint, value, ...props }, ref) => {
    const currentLength = typeof value === 'string' ? value.length : 0
    const isNearLimit = maxLength && currentLength > maxLength * 0.9
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1 text-sm font-medium text-foreground">
            {label}
            {required && (
              <span className="text-primary text-xs">*</span>
            )}
          </label>
          {showCounter && (
            <span className={cn(
              "text-xs tabular-nums transition-colors",
              isNearLimit ? "text-destructive" : "text-muted-foreground"
            )}>
              {currentLength.toLocaleString()}{maxLength && ` / ${maxLength.toLocaleString()}`}
            </span>
          )}
        </div>
        <textarea
          className={cn(
            "flex min-h-[120px] w-full rounded-xl border bg-background px-4 py-3 text-sm transition-all duration-200",
            "placeholder:text-muted-foreground/60",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
            "hover:border-primary/50",
            "resize-y",
            error 
              ? "border-destructive focus:ring-destructive/20 focus:border-destructive" 
              : "border-input",
            className
          )}
          ref={ref}
          value={value}
          maxLength={maxLength}
          {...props}
        />
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
TextAreaField.displayName = "TextAreaField"

export { TextAreaField }
