"use client";
import { MessageSquare, Zap, UserPlus, DollarSign, Gauge, TrendingUp } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  MessagesChart,
  ConversionFunnel,
  AutomationPerformance,
  ResponseTimeChart,
} from "@/components/dashboard/overview-charts";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { ConversationFeed } from "@/components/dashboard/conversation-feed";

const stats = [
  { label: "Total conversations", value: "8,492", delta: "+12.4%", icon: MessageSquare },
  { label: "Messages today", value: "1,284", delta: "+18.2%", icon: Zap },
  { label: "Automation triggered", value: "3,910", delta: "+9.1%", icon: Gauge },
  { label: "Leads captured", value: "612", delta: "+7.6%", icon: UserPlus },
  { label: "Revenue generated", value: "$24,180", delta: "+21.3%", icon: DollarSign },
  { label: "AI score", value: "94/100", delta: "+2.0%", icon: TrendingUp },
];

export default function DashboardOverviewPage() {
  return (
    <DashboardShell breadcrumb={[{ label: "Workspace" }, { label: "Overview" }]}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
            Good morning, Jordan
          </h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            Here's how Acme Studio is performing today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MessagesChart />
        </div>
        <ConversionFunnel />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AutomationPerformance />
        <ResponseTimeChart />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ConversationFeed />
        <ActivityTimeline />
      </div>
    </DashboardShell>
  );
}
