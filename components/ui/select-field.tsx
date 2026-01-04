'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface SelectFieldProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string; description?: string }>;
  required?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
  hint?: string;
}

export function SelectField({
  label,
  value,
  onValueChange,
  options,
  required = false,
  error,
  placeholder = 'Select an option...',
  className,
  hint,
}: SelectFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="flex items-center gap-1 text-sm font-medium text-foreground">
        {label}
        {required && (
          <span className="text-primary text-xs">*</span>
        )}
      </label>

      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            'w-full h-11 rounded-xl border bg-background transition-all duration-200',
            'hover:border-primary/50',
            'focus:ring-2 focus:ring-primary/20 focus:border-primary',
            error 
              ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' 
              : 'border-input'
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-border shadow-soft-lg">
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="rounded-lg cursor-pointer focus:bg-accent"
            >
              <div className="flex flex-col py-0.5">
                <span className="font-medium">{option.label}</span>
                {option.description && (
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {option.description}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
  );
}
