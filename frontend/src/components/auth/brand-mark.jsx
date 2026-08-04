import { Zap } from "lucide-react";

export function BrandMark({ className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-glow">
        <Zap className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
      </div>
      <span className="text-[15px] font-semibold tracking-tight text-foreground">
        FlowDM <span className="text-muted-foreground font-normal">AI</span>
      </span>
    </div>
  );
}
