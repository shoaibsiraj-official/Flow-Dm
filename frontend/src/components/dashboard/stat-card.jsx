"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, delta, positive = true, icon: Icon, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface/70 p-5 transition-colors hover:border-white/15"
    >
      <div className="flex items-start justify-between">
        <p className="text-[13px] text-muted-foreground">{label}</p>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <p className="mt-3 text-[26px] font-semibold tracking-tight text-foreground">{value}</p>
      <div className="mt-2 flex items-center gap-1">
        <span
          className={cn(
            "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11.5px] font-medium",
            positive ? "bg-success/12 text-success" : "bg-danger/12 text-danger"
          )}
        >
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {delta}
        </span>
        <span className="text-[11.5px] text-muted-foreground">vs last week</span>
      </div>
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/[0.06] blur-2xl transition-opacity group-hover:opacity-100" />
    </motion.div>
  );
}
