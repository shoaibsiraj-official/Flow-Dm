"use client";

import { Settings2 } from "lucide-react";
import { NODE_TYPES } from "@/lib/constants/automation-nodes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NodeConfigPanel({ node, onChange }) {
  if (!node) {
    return (
      <div className="flex w-80 shrink-0 flex-col items-center justify-center border-l border-border p-8 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.05] text-muted-foreground">
          <Settings2 className="h-5 w-5" />
        </div>
        <p className="mt-3 text-[13px] font-medium text-foreground">No node selected</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Click any node on the canvas to configure it here.
        </p>
      </div>
    );
  }

  const def = NODE_TYPES[node.type];
  const Icon = def.icon;

  return (
    <div className="no-scrollbar w-80 shrink-0 overflow-y-auto border-l border-border p-5">
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `${def.color}22`, color: def.color }}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{def.label}</p>
          <p className="text-[13.5px] font-semibold text-foreground">Node settings</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <Label htmlFor="node-title">Step name</Label>
          <div className="mt-1.5">
            <Input
              id="node-title"
              value={node.title}
              onChange={(e) => onChange({ ...node, title: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="node-config">{configLabel(node.type)}</Label>
          <div className="mt-1.5">
            <textarea
              id="node-config"
              value={node.config}
              onChange={(e) => onChange({ ...node, config: e.target.value })}
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-surface-sunken/60 p-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
            />
          </div>
        </div>

        {node.type === "ai" && (
          <div className="rounded-xl border border-border bg-surface/60 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Brand voice</p>
            <p className="mt-1.5 text-[12.5px] text-foreground/85">
              Uses your saved brand voice and knowledge base to draft the reply automatically.
            </p>
          </div>
        )}

        {node.type === "delay" && (
          <div className="grid grid-cols-2 gap-2">
            <Input defaultValue="2" />
            <select className="h-11 rounded-xl border border-border bg-surface-sunken/60 px-3 text-[13px] text-foreground focus:border-primary/50 focus:outline-none">
              <option>Minutes</option>
              <option>Hours</option>
              <option>Days</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

function configLabel(type) {
  switch (type) {
    case "trigger": return "Trigger condition";
    case "condition": return "Condition logic";
    case "webhook": return "Webhook URL";
    case "api": return "API endpoint";
    default: return "Description";
  }
}
