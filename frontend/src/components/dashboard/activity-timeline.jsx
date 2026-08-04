import { MessageCircle, UserPlus, Workflow, CreditCard, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const activity = [
  { icon: UserPlus, tone: "success", text: "New lead qualified from @willowhome", time: "2 min ago" },
  { icon: Workflow, tone: "primary", text: "\u201cComment \u2192 DM\u201d automation triggered 24 times", time: "18 min ago" },
  { icon: MessageCircle, tone: "primary", text: "AI resolved 12 conversations without handoff", time: "1 hr ago" },
  { icon: CreditCard, tone: "success", text: "$1,240 revenue attributed to Spring Sale campaign", time: "3 hr ago" },
  { icon: AlertTriangle, tone: "warning", text: "\u201cAbandoned Lead\u201d automation hit daily send limit", time: "5 hr ago" },
];

const toneDot = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
};
const toneBg = {
  primary: "bg-primary/12 text-primary-400",
  success: "bg-success/12 text-success",
  warning: "bg-warning/12 text-warning",
};

export function ActivityTimeline() {
  return (
    <Card className="p-5">
      <p className="mb-4 text-[14px] font-semibold text-foreground">Recent activity</p>
      <div className="relative space-y-5 pl-1">
        <div className="absolute bottom-2 left-[15px] top-2 w-px bg-border" />
        {activity.map((a, i) => (
          <div key={i} className="relative flex gap-3">
            <div className={cn("z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", toneBg[a.tone])}>
              <a.icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-[13px] leading-snug text-foreground/90">{a.text}</p>
              <p className="mt-0.5 text-[11.5px] text-muted-foreground">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
