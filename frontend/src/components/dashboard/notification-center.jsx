"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, MessageCircle, UserPlus, AlertTriangle, Sparkles } from "lucide-react";
import { useClickOutside } from "@/lib/hooks/use-click-outside";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: 1,
    icon: MessageCircle,
    tone: "primary",
    title: "New DM from @studio.lena",
    detail: "\u201cDo you ship to Canada?\u201d",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    icon: UserPlus,
    tone: "success",
    title: "New lead captured",
    detail: "@willowhome qualified via Welcome Flow",
    time: "18m ago",
    unread: true,
  },
  {
    id: 3,
    icon: AlertTriangle,
    tone: "warning",
    title: "Automation paused",
    detail: "\u201cAbandoned Lead\u201d hit its daily send limit",
    time: "1h ago",
    unread: true,
  },
  {
    id: 4,
    icon: Sparkles,
    tone: "primary",
    title: "Weekly AI summary is ready",
    detail: "312 conversations, 94% positive sentiment",
    time: "Yesterday",
    unread: false,
  },
];

const toneClasses = {
  primary: "bg-primary/15 text-primary-400",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
};

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-danger ring-2 ring-surface" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-[360px] rounded-2xl border border-border bg-surface-raised shadow-soft"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-[13.5px] font-semibold text-foreground">Notifications</p>
              <button className="text-[12px] font-medium text-primary-400 hover:text-primary">
                Mark all read
              </button>
            </div>
            <div className="no-scrollbar max-h-[360px] overflow-y-auto py-1.5">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/[0.04]"
                >
                  <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", toneClasses[n.tone])}>
                    <n.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-foreground">{n.title}</p>
                    <p className="truncate text-[12.5px] text-muted-foreground">{n.detail}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/70">{n.time}</p>
                  </div>
                  {n.unread && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
            <div className="border-t border-border px-4 py-2.5 text-center">
              <button className="text-[12.5px] font-medium text-muted-foreground hover:text-foreground">
                View all activity
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
