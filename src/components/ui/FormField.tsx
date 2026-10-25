import * as React from "react";
import { cn } from "@/lib/utils";

export interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Field({
  label,
  error,
  required,
  className = "",
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 text-left", className)}>
      <label className="font-mono text-xs text-muted uppercase tracking-wider">
        {label} {required && <span className="text-ink">*</span>}
      </label>
      {children}
      {error && (
        <span className="font-mono text-xs text-ink/80">{error}</span>
      )}
    </div>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full bg-paper border border-line px-3 py-2 text-sm text-ink placeholder:text-muted/60 rounded-[2px] transition-colors focus:border-ink focus-visible:outline-2 focus-visible:outline-signal min-h-[44px]",
          error && "border-ink",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full bg-paper border border-line px-3 py-2 text-sm text-ink placeholder:text-muted/60 rounded-[2px] transition-colors focus:border-ink focus-visible:outline-2 focus-visible:outline-signal min-h-[88px]",
          error && "border-ink",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full bg-paper border border-line px-3 py-2 text-sm text-ink rounded-[2px] transition-colors focus:border-ink focus-visible:outline-2 focus-visible:outline-signal min-h-[44px]",
          error && "border-ink",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";
