"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Workflow, MoreHorizontal, Zap } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TemplateGalleryModal } from "@/components/automation/template-gallery-modal";
import { cn } from "@/lib/utils";

const existingFlows = [
  { id: "f1", name: "Welcome Flow", nodes: 5, runs: "2,140", active: true, color: "#22C55E" },
  { id: "f2", name: "Comment \u2192 DM \u2014 Spring Sale", nodes: 4, runs: "980", active: true, color: "#6366F1" },
  { id: "f3", name: "Abandoned Lead Follow-up", nodes: 4, runs: "312", active: false, color: "#EF4444" },
];

export default function AutomationListPage() {
  const [showGallery, setShowGallery] = useState(false);
  const router = useRouter();

  const startFlow = (templateId) => {
    setShowGallery(false);
    const q = templateId ? `?template=${templateId}` : "";
    router.push(`/automation/builder${q}`);
  };

  return (
    <DashboardShell breadcrumb={[{ label: "Automate" }, { label: "Automation builder" }]}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Automations</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            Build visual workflows that reply, tag, and convert while you're offline.
          </p>
        </div>
        <Button onClick={() => setShowGallery(true)}>
          <Plus className="h-4 w-4" /> New automation
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {existingFlows.map((f) => (
          <Card
            key={f.id}
            className="group cursor-pointer p-5 transition-colors hover:border-white/15"
            onClick={() => router.push(`/automation/builder?flow=${f.id}`)}
          >
            <div className="flex items-start justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: `${f.color}22`, color: f.color }}
              >
                <Workflow className="h-5 w-5" />
              </div>
              <button
                onClick={(e) => e.stopPropagation()}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-opacity hover:bg-white/[0.06] hover:text-foreground group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 text-[14.5px] font-semibold text-foreground">{f.name}</p>
            <p className="mt-1 text-[12.5px] text-muted-foreground">{f.nodes} nodes &middot; {f.runs} runs this month</p>
            <div className="mt-4 flex items-center gap-1.5">
              <span
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                  f.active ? "bg-success/12 text-success" : "bg-white/[0.06] text-muted-foreground"
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", f.active ? "bg-success" : "bg-muted-foreground")} />
                {f.active ? "Active" : "Paused"}
              </span>
            </div>
          </Card>
        ))}

        <button
          onClick={() => setShowGallery(true)}
          className="flex min-h-[168px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary-400"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05]">
            <Zap className="h-5 w-5" />
          </div>
          <span className="text-[13.5px] font-medium">Create a new flow</span>
        </button>
      </div>

      {showGallery && (
        <TemplateGalleryModal onClose={() => setShowGallery(false)} onSelect={startFlow} />
      )}
    </DashboardShell>
  );
}
