"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef(
  ({ className, type = "text", icon: Icon, error, rightElement, ...props }, ref) => {
    return (
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-xl border bg-surface-sunken/60 px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-150",
            "border-border focus:border-primary/60 focus:bg-surface-sunken focus:outline-none focus:ring-2 focus:ring-primary/20",
            Icon && "pl-10",
            rightElement && "pr-10",
            error && "border-danger/60 focus:border-danger/60 focus:ring-danger/20",
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
