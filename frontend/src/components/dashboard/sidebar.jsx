"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, Zap } from "lucide-react";
import { NAV_SECTIONS } from "@/lib/constants/nav";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-border bg-surface/60 transition-[width] duration-200 ease-out",
        collapsed ? "w-[76px]" : "w-64"
      )}
    >
      <div className={cn("flex items-center gap-2.5 px-4 py-4", collapsed && "justify-center px-0")}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-glow">
          <Zap className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            FlowDM <span className="font-normal text-muted-foreground">AI</span>
          </span>
        )}
      </div>

      <div className="px-3">
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      <nav className="no-scrollbar mt-4 flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="mb-1.5 px-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13.5px] font-medium transition-colors duration-150",
                      collapsed && "justify-center",
                      active
                        ? "bg-primary/12 text-foreground"
                        : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-primary" />
                    )}
                    <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary-400")} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="ml-auto rounded-full bg-white/[0.07] px-1.5 py-0.5 text-[10.5px] font-medium text-muted-foreground">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed((c) => !c)}
        className={cn(
          "mx-3 mb-3 flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground",
          collapsed && "justify-center"
        )}
      >
        {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        {!collapsed && "Collapse"}
      </button>
    </aside>
  );
}
