"use client";

import { useState } from "react";
import { Search, Pin, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

const filters = ["All", "Unread", "Assigned to me", "Priority"];

const priorityDot = { high: "bg-danger", medium: "bg-warning", low: "bg-muted-foreground" };

export function ConversationList({ conversations, activeId, onSelect }) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = conversations
    .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    .filter((c) => {
      if (filter === "Unread") return c.unread;
      if (filter === "Assigned to me") return c.assigned === "Jordan Lee";
      if (filter === "Priority") return c.priority === "high";
      return true;
    })
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="flex h-full w-[340px] shrink-0 flex-col border-r border-border">
      <div className="border-b border-border p-4">
        <p className="mb-3 text-[15px] font-semibold text-foreground">Inbox</p>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations…"
            className="h-9 w-full rounded-xl border border-border bg-surface-sunken/60 pl-9 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                filter === f
                  ? "bg-primary/15 text-primary-400"
                  : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto">
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={cn(
              "flex w-full items-start gap-3 border-b border-border/60 px-4 py-3.5 text-left transition-colors",
              activeId === c.id ? "bg-primary/[0.07]" : "hover:bg-white/[0.03]"
            )}
          >
            <div className="relative shrink-0">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-semibold text-white"
                style={{ background: c.avatarColor }}
              >
                <Camera className="h-4 w-4" />
              </div>
              {c.unread && (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className={cn("flex items-center gap-1 truncate text-[13px]", c.unread ? "font-semibold text-foreground" : "font-medium text-foreground/80")}>
                  {c.pinned && <Pin className="h-3 w-3 shrink-0 text-muted-foreground" />}
                  {c.name}
                </span>
                <span className="shrink-0 text-[11px] text-muted-foreground">{c.time}</span>
              </div>
              <p className="truncate text-[12.5px] text-muted-foreground">{c.preview}</p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className={cn("h-1.5 w-1.5 rounded-full", priorityDot[c.priority])} />
                {c.labels.map((l) => (
                  <span key={l} className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="px-4 py-10 text-center text-[13px] text-muted-foreground">
            No conversations match this filter.
          </p>
        )}
      </div>
    </div>
  );
}
