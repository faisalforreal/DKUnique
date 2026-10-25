import React, { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "stagePrimary" | "stageSecondary" | "link";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      href,
      external,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-body text-sm font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-signal rounded-[2px] min-h-[44px]";

    const variantStyles = {
      primary:
        "bg-ink text-paper hover:bg-ink/90 active:bg-ink/95 border border-ink",
      secondary:
        "bg-transparent text-ink border border-ink hover:bg-ink/5 active:bg-ink/10",
      stagePrimary:
        "bg-paper text-ink hover:bg-paper/90 active:bg-paper/95 border border-paper",
      stageSecondary:
        "bg-transparent text-paper border border-line/40 hover:border-paper active:border-paper/80",
      link: "bg-transparent text-ink underline underline-offset-4 hover:text-muted p-0 min-h-0",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs min-h-[38px] md:min-h-[36px]",
      md: "px-5 py-2.5 text-sm min-h-[44px]",
      lg: "px-6 py-3.5 text-base min-h-[48px]",
    };

    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      variant !== "link" ? sizeStyles[size] : "",
      className
    );

    if (href) {
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={combinedClassName}
          >
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={combinedClassName}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
