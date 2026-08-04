"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  Paperclip,
  Mic,
  Languages,
  Send,
  Smile,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClickOutside } from "@/lib/hooks/use-click-outside";
import { quickReplies } from "@/lib/mock/inbox-data";
import { cn } from "@/lib/utils";

export function Composer({ notesOnly = false, onSend }) {
  const [text, setText] = useState("");
  const [showQuick, setShowQuick] = useState(false);
  const [recording, setRecording] = useState(false);
  const quickRef = useRef(null);
  useClickOutside(quickRef, () => setShowQuick(false));

  const handleSend = () => {
    if (!text.trim()) return;
    setText("");
    onSend?.(text);
  };

  return (
    <div className={cn("border-t border-border p-4", notesOnly && "bg-warning/[0.04]")}>
      <div className="flex items-center gap-1.5 pb-2">
        <div className="relative" ref={quickRef}>
          <button
            onClick={() => setShowQuick((s) => !s)}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11.5px] font-medium text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
          >
            <Zap className="h-3.5 w-3.5" /> Quick replies
          </button>
          <AnimatePresence>
            {showQuick && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute bottom-full left-0 z-20 mb-2 w-72 rounded-2xl border border-border bg-surface-raised p-1.5 shadow-soft"
              >
                {quickReplies.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setText(q);
                      setShowQuick(false);
                    }}
                    className="w-full rounded-lg px-2.5 py-2 text-left text-[12.5px] text-foreground/90 transition-colors hover:bg-white/[0.06]"
                  >
                    {q}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={() => setText((t) => t || "Sure! Here's what I'd suggest based on this conversation: ")}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11.5px] font-medium text-primary-400 transition-colors hover:bg-primary/10"
        >
          <Sparkles className="h-3.5 w-3.5" /> AI reply
        </button>
        <button className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11.5px] font-medium text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground">
          <Languages className="h-3.5 w-3.5" /> Translate
        </button>
      </div>

      <div
        className={cn(
          "flex items-end gap-2 rounded-2xl border bg-surface-sunken/60 p-2 transition-colors focus-within:border-primary/50",
          notesOnly ? "border-warning/30" : "border-border"
        )}
      >
        <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-white/[0.06] hover:text-foreground">
          <Paperclip className="h-4 w-4" />
        </button>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={1}
          placeholder={notesOnly ? "Leave an internal note (not visible to customer)…" : "Write a reply…"}
          className="max-h-32 flex-1 resize-none bg-transparent py-1.5 text-[13.5px] text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-white/[0.06] hover:text-foreground">
          <Smile className="h-4 w-4" />
        </button>
        <button
          onClick={() => setRecording((r) => !r)}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors",
            recording ? "bg-danger/15 text-danger" : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
          )}
        >
          <Mic className="h-4 w-4" />
        </button>
        <Button size="icon" className="h-8 w-8 shrink-0 rounded-xl" onClick={handleSend}>
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
      {recording && (
        <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-danger">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-danger" /> Recording voice message…
        </p>
      )}
    </div>
  );
}
