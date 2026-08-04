"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Inbox, Users, Workflow, Megaphone, CornerDownLeft } from "lucide-react";

const results = [
  { icon: Inbox, label: "Conversation with @studio.lena", section: "Inbox" },
  { icon: Users, label: "Marcus Rivera — Lead profile", section: "CRM" },
  { icon: Workflow, label: "Welcome Flow automation", section: "Automation" },
  { icon: Megaphone, label: "Spring Sale broadcast", section: "Campaigns" },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = results.filter((r) =>
    r.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-full max-w-[340px] items-center gap-2.5 rounded-xl border border-border bg-surface-sunken/60 px-3 text-[13px] text-muted-foreground transition-colors hover:border-white/15"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search anything…</span>
        <kbd className="rounded-md border border-border bg-white/[0.04] px-1.5 py-0.5 text-[10.5px] font-medium">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-1/2 top-[14%] z-[101] w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-soft"
            >
              <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
                <Search className="h-4.5 w-4.5 text-muted-foreground" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search conversations, leads, automations…"
                  className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <kbd className="rounded-md border border-border px-1.5 py-0.5 text-[10.5px] text-muted-foreground">
                  ESC
                </kbd>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <p className="px-3 py-6 text-center text-[13px] text-muted-foreground">
                    No results for “{query}”
                  </p>
                ) : (
                  filtered.map((r, i) => (
                    <button
                      key={i}
                      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.06]"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05]">
                        <r.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] text-foreground">{r.label}</p>
                        <p className="text-[11.5px] text-muted-foreground">{r.section}</p>
                      </div>
                      <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
