"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User, Settings, CreditCard, Moon, Sun, LogOut, ChevronDown } from "lucide-react";
import { useClickOutside } from "@/lib/hooks/use-click-outside";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-white/[0.06]"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-600 text-[12px] font-semibold text-white">
          JL
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 rounded-2xl border border-border bg-surface-raised p-1.5 shadow-soft"
          >
            <div className="flex items-center gap-3 px-2.5 py-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-600 text-[13px] font-semibold text-white">
                JL
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-medium text-foreground">Jordan Lee</p>
                <p className="truncate text-[12px] text-muted-foreground">jordan@acmestudio.com</p>
              </div>
            </div>
            <div className="my-1 h-px bg-border" />

            <MenuItem icon={User} label="Your profile" />
            <MenuItem icon={CreditCard} label="Billing" />
            <MenuItem icon={Settings} label="Settings" />

            <button
              onClick={() => setDark((d) => !d)}
              className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-[13px] text-foreground/90 transition-colors hover:bg-white/[0.06]"
            >
              <span className="flex items-center gap-2.5">
                {dark ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
                Dark mode
              </span>
              <span
                className={`relative h-5 w-9 rounded-full transition-colors ${dark ? "bg-primary" : "bg-white/10"}`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                    dark ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </span>
            </button>

            <div className="my-1 h-px bg-border" />
            <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-danger transition-colors hover:bg-danger/10">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({ icon: Icon, label }) {
  return (
    <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-foreground/90 transition-colors hover:bg-white/[0.06]">
      <Icon className="h-4 w-4 text-muted-foreground" /> {label}
    </button>
  );
}
