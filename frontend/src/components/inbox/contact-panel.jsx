"use client";

import { useState } from "react";
import {
  Camera,
  MapPin,
  Calendar,
  Tag as TagIcon,
  Plus,
  Star,
  MessageSquare,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const history = [
  { icon: MessageSquare, text: "Conversation started via comment reply", time: "3 weeks ago" },
  { icon: ShoppingBag, text: "Purchased \u201cLinen Set — Sand\u201d, $128", time: "2 weeks ago" },
  { icon: MessageSquare, text: "Asked about restock timing", time: "5 days ago" },
];

export function ContactPanel({ conversation }) {
  const [note, setNote] = useState("");

  if (!conversation) return <div className="w-[300px] shrink-0 border-l border-border" />;

  return (
    <div className="no-scrollbar w-[300px] shrink-0 overflow-y-auto border-l border-border p-5">
      <div className="flex flex-col items-center text-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full text-white"
          style={{ background: conversation.avatarColor }}
        >
          <Camera className="h-6 w-6" />
        </div>
        <p className="mt-3 text-[14.5px] font-semibold text-foreground">{conversation.name}</p>
        <p className="text-[12px] text-muted-foreground">Instagram DM lead</p>
        <div className="mt-3 flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          <span className="text-[12.5px] font-medium text-foreground">Lead score 82</span>
        </div>
      </div>

      <div className="mt-6 space-y-3 rounded-xl border border-border bg-surface/60 p-3.5">
        <InfoRow icon={MapPin} label="Toronto, Canada" />
        <InfoRow icon={Calendar} label="Customer since Mar 2026" />
        <InfoRow icon={TagIcon} label={conversation.labels.join(", ")} />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">Tags</p>
          <button className="text-muted-foreground hover:text-foreground">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["VIP", "Repeat buyer", ...conversation.labels].map((t) => (
            <span key={t} className="rounded-full bg-white/[0.06] px-2 py-1 text-[11px] font-medium text-foreground/80">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
          Internal note
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note only your team can see…"
          rows={3}
          className="w-full resize-none rounded-xl border border-border bg-surface-sunken/60 p-2.5 text-[12.5px] text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
        />
      </div>

      <div className="mt-5">
        <p className="mb-3 text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
          Conversation history
        </p>
        <div className="space-y-3">
          {history.map((h, i) => (
            <div key={i} className="flex gap-2.5">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-muted-foreground">
                <h.icon className="h-3 w-3" />
              </div>
              <div>
                <p className="text-[12px] leading-snug text-foreground/85">{h.text}</p>
                <p className="text-[10.5px] text-muted-foreground">{h.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2.5 text-[12.5px] text-foreground/80">
      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <span className="truncate">{label}</span>
    </div>
  );
}
