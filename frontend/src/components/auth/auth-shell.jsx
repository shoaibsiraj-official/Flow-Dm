import { BrandMark } from "./brand-mark";
import { LivePanel } from "./live-panel";

export function AuthShell({ children, footer }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left: form column */}
      <div className="flex w-full flex-col justify-between px-6 py-8 sm:px-10 lg:w-[46%] lg:px-16 lg:py-10 xl:w-[40%]">
        <BrandMark />

        <div className="mx-auto w-full max-w-[380px] animate-fade-up">{children}</div>

        <p className="text-center text-[12.5px] text-muted-foreground lg:text-left">
          {footer ?? (
            <>© {new Date().getFullYear()} FlowDM AI. All rights reserved.</>
          )}
        </p>
      </div>

      {/* Right: signature live panel */}
      <div className="relative hidden flex-1 border-l border-border bg-surface-sunken lg:block">
        <LivePanel />
      </div>
    </div>
  );
}
