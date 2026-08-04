import { Camera, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const conversations = [
  { name: "@studio.lena", preview: "Do you ship to Canada?", time: "2m", unread: true, tag: "AI replied" },
  { name: "@marcus.fit", preview: "Is the coaching bundle still 20% off?", time: "18m", unread: true, tag: "AI replied" },
  { name: "@willowhome", preview: "Booked a call for Thursday, thank you!", time: "1h", unread: false, tag: "Resolved" },
  { name: "@dara.creates", preview: "Can I get a size chart?", time: "2h", unread: false, tag: "AI replied" },
  { name: "@noah.builds", preview: "What's included in the Pro plan?", time: "3h", unread: false, tag: "Escalated" },
];

const tagStyles = {
  "AI replied": "bg-primary/12 text-primary-400",
  Resolved: "bg-success/12 text-success",
  Escalated: "bg-warning/12 text-warning",
};

export function ConversationFeed() {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[14px] font-semibold text-foreground">Conversation feed</p>
        <button className="text-[12px] font-medium text-primary-400 hover:text-primary">
          Open inbox
        </button>
      </div>
      <div className="space-y-1">
        {conversations.map((c) => (
          <button
            key={c.name}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-white/[0.04]"
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
              <Camera className="h-4 w-4 text-foreground/70" />
              {c.unread && (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-surface" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className={cn("truncate text-[13px]", c.unread ? "font-semibold text-foreground" : "font-medium text-foreground/80")}>
                  {c.name}
                </p>
                <span className="shrink-0 text-[11px] text-muted-foreground">{c.time}</span>
              </div>
              <p className="truncate text-[12.5px] text-muted-foreground">{c.preview}</p>
            </div>
            <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium", tagStyles[c.tag])}>
              {c.tag}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
