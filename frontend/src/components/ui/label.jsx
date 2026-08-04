"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Label = forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-[13px] font-medium text-foreground/90", className)}
    {...props}
  />
));
Label.displayName = "Label";

export function FieldError({ children }) {
  if (!children) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-[12.5px] text-danger animate-fade-in">
      {children}
    </p>
  );
}

export { Label };
