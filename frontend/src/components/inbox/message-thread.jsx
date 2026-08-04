"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sparkles, Phone, Video, MoreHorizontal, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Composer } from "./composer";

export function MessageThread({ conversation }) {
  const [showTyping, setShowTyping] = useState(false);
  const [notesOnly, setNotesOnly] = useState(false);

  if (!conversation) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-[13.5px] text-muted-foreground">Select a conversation to get started</p>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-white"
          style={{ background: conversation.avatarColor }}
        >
          <Camera className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-semibold text-foreground">{conversation.name}</p>
          <p className="text-[11.5px] text-muted-foreground">
            Assigned to {conversation.assigned}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-6 py-6">
        {conversation.messages.map((m) => (
          <Bubble key={m.id} message={m} />
        ))}

        <AnimatePresence>
          {showTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 rounded-2xl bg-surface-raised px-4 py-3 w-fit"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                  style={{ animation: `float 1s ease-in-out ${i * 0.15}s infinite` }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-border px-5 py-2">
        <button
          onClick={() => setNotesOnly((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11.5px] font-medium transition-colors",
            notesOnly ? "bg-warning/15 text-warning" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Lock className="h-3 w-3" /> {notesOnly ? "Internal note mode" : "Switch to internal note"}
        </button>
      </div>

      <Composer
        notesOnly={notesOnly}
        onSend={() => {
          setShowTyping(true);
          setTimeout(() => setShowTyping(false), 1800);
        }}
      />
    </div>
  );
}

function Bubble({ message }) {
  const isCustomer = message.from === "customer";
  const isNote = message.from === "note";

  if (isNote) {
    return (
      <div className="flex justify-center">
        <div className="flex items-center gap-1.5 rounded-lg bg-warning/10 px-3 py-1.5 text-[12px] text-warning">
          <Lock className="h-3 w-3" /> {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex", isCustomer ? "justify-start" : "justify-end")}>
      <div className={cn("max-w-[70%]", !isCustomer && "flex flex-col items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed",
            isCustomer
              ? "rounded-bl-md bg-surface-raised text-foreground"
              : "rounded-br-md bg-primary text-white"
          )}
        >
          {message.text}
        </div>
        <div className="mt-1 flex items-center gap-1.5 px-1">
          {message.from === "ai" && (
            <span className="flex items-center gap-0.5 text-[10.5px] font-medium text-primary-400">
              <Sparkles className="h-2.5 w-2.5" /> AI
            </span>
          )}
          <span className="text-[10.5px] text-muted-foreground">{message.time}</span>
        </div>
      </div>
    </div>
  );
}
