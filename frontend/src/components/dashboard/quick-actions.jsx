"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Workflow, Megaphone, UserPlus, MessageSquarePlus } from "lucide-react";
import { useClickOutside } from "@/lib/hooks/use-click-outside";
import { Button } from "@/components/ui/button";

const actions = [
  { icon: Workflow, label: "New automation" },
  { icon: Megaphone, label: "New broadcast campaign" },
  { icon: UserPlus, label: "Add lead" },
  { icon: MessageSquarePlus, label: "New saved reply" },
];

export function QuickActions() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <Button onClick={() => setOpen((o) => !o)} size="sm">
        <Plus className="h-4 w-4" /> Quick create
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-60 rounded-2xl border border-border bg-surface-raised p-1.5 shadow-soft"
          >
            {actions.map((a) => (
              <button
                key={a.label}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-foreground/90 transition-colors hover:bg-white/[0.06]"
              >
                <a.icon className="h-4 w-4 text-muted-foreground" /> {a.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
