import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface/80 shadow-soft",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
