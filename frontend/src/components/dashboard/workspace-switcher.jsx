"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronsUpDown, Check, Plus } from "lucide-react";
import { useClickOutside } from "@/lib/hooks/use-click-outside";
import { cn } from "@/lib/utils";

const workspaces = [
  { id: 1, name: "Acme Studio", plan: "Growth", color: "#6366F1" },
  { id: 2, name: "Willow Home", plan: "Starter", color: "#22C55E" },
  { id: 3, name: "Marcus Fitness", plan: "Pro", color: "#F59E0B" },
];

export function WorkspaceSwitcher({ collapsed }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(workspaces[0]);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-xl border border-border bg-surface-raised/60 px-2.5 py-2 text-left transition-colors hover:bg-white/[0.06]",
          collapsed && "justify-center px-0"
        )}
      >
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold text-white"
          style={{ background: active.color }}
        >
          {active.name.charAt(0)}
        </div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-foreground">{active.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{active.plan} plan</p>
            </div>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-[calc(100%+6px)] z-50 w-64 rounded-2xl border border-border bg-surface-raised p-1.5 shadow-soft"
          >
            <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Your workspaces
            </p>
            {workspaces.map((w) => (
              <button
                key={w.id}
                onClick={() => {
                  setActive(w);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white/[0.06]"
              >
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10.5px] font-semibold text-white"
                  style={{ background: w.color }}
                >
                  {w.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] text-foreground">{w.name}</p>
                  <p className="text-[11px] text-muted-foreground">{w.plan}</p>
                </div>
                {w.id === active.id && <Check className="h-3.5 w-3.5 text-primary-400" />}
              </button>
            ))}
            <div className="my-1 h-px bg-border" />
            <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-primary-400 transition-colors hover:bg-white/[0.06]">
              <Plus className="h-3.5 w-3.5" /> Add workspace
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
