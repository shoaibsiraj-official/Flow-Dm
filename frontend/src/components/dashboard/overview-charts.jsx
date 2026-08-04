"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import { Card } from "@/components/ui/card";

const messageData = [
  { day: "Mon", messages: 820, automated: 610 },
  { day: "Tue", messages: 932, automated: 710 },
  { day: "Wed", messages: 901, automated: 690 },
  { day: "Thu", messages: 1120, automated: 890 },
  { day: "Fri", messages: 1284, automated: 1010 },
  { day: "Sat", messages: 980, automated: 760 },
  { day: "Sun", messages: 860, automated: 640 },
];

const funnelData = [
  { stage: "DM received", value: 4820 },
  { stage: "AI engaged", value: 3960 },
  { stage: "Qualified", value: 2140 },
  { stage: "Booked / Purchased", value: 918 },
];

const responseTimeData = [
  { day: "Mon", seconds: 14 },
  { day: "Tue", seconds: 12 },
  { day: "Wed", seconds: 11 },
  { day: "Thu", seconds: 9 },
  { day: "Fri", seconds: 8 },
  { day: "Sat", seconds: 9 },
  { day: "Sun", seconds: 8 },
];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-surface-raised px-3 py-2 text-[12px] shadow-soft">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-muted-foreground">
          {p.name}: <span className="font-medium text-foreground">{p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
}

export function MessagesChart() {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[14px] font-semibold text-foreground">Daily messages</p>
          <p className="text-[12px] text-muted-foreground">Total vs. AI-automated replies</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={messageData} margin={{ left: -20, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="msgGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="autoGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22C55E" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="messages" name="Total" stroke="#6366F1" strokeWidth={2} fill="url(#msgGradient)" />
          <Area type="monotone" dataKey="automated" name="Automated" stroke="#22C55E" strokeWidth={2} fill="url(#autoGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function ConversionFunnel() {
  const max = funnelData[0].value;
  return (
    <Card className="p-5">
      <p className="text-[14px] font-semibold text-foreground">Conversion funnel</p>
      <p className="mb-5 text-[12px] text-muted-foreground">DM to booked / purchased, last 30 days</p>
      <div className="space-y-3">
        {funnelData.map((f, i) => (
          <div key={f.stage}>
            <div className="mb-1 flex items-center justify-between text-[12.5px]">
              <span className="text-muted-foreground">{f.stage}</span>
              <span className="font-medium text-foreground">{f.value.toLocaleString()}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-400"
                style={{ width: `${(f.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function AutomationPerformance() {
  const data = [
    { name: "Comment → DM", rate: 68 },
    { name: "Keyword Reply", rate: 74 },
    { name: "Welcome Flow", rate: 81 },
    { name: "Abandoned Lead", rate: 52 },
  ];
  return (
    <Card className="p-5">
      <p className="text-[14px] font-semibold text-foreground">Automation performance</p>
      <p className="mb-4 text-[12px] text-muted-foreground">Completion rate by workflow</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16 }}>
          <XAxis type="number" hide domain={[0, 100]} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={110}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="rate" name="Completion %" fill="#6366F1" radius={[0, 6, 6, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function ResponseTimeChart() {
  return (
    <Card className="p-5">
      <p className="text-[14px] font-semibold text-foreground">Response time</p>
      <p className="mb-4 text-[12px] text-muted-foreground">Average seconds to first AI reply</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={responseTimeData} margin={{ left: -20, right: 8, top: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} />
          <Line type="monotone" dataKey="seconds" name="Seconds" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3, fill: "#F59E0B" }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
