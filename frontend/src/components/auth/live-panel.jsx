"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, MessageCircle, Camera } from "lucide-react";

const messages = [
  { id: 1, name: "@studio.lena", text: "Do you ship to Canada?", reply: true, delay: 0 },
  { id: 2, name: "@marcus.fit", text: "Is the coaching bundle still 20% off?", reply: true, delay: 0.9 },
  { id: 3, name: "@willowhome", text: "Booked a call for Thursday ✅", reply: false, delay: 1.8 },
];

const stats = [
  { label: "Messages today", value: "1,284", delta: "+18%" },
  { label: "Leads captured", value: "96", delta: "+7%" },
  { label: "Avg. reply time", value: "8s", delta: "-42%" },
];

export function LivePanel() {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden p-10">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/25 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />

      <div className="relative z-10">
        <p className="max-w-sm text-[26px] font-semibold leading-[1.25] tracking-tight text-gradient">
          Every DM answered in seconds, not shifts.
        </p>
        <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
          FlowDM AI reads intent, replies on-brand, and books the lead — while
          you sleep.
        </p>
      </div>

      {/* live conversation cards */}
      <div className="relative z-10 my-8 flex flex-1 flex-col justify-center gap-3">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: m.delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass w-full max-w-sm rounded-2xl px-4 py-3 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                  <Camera className="h-3 w-3 text-foreground/80" />
                </div>
                <span className="text-[12.5px] font-medium text-foreground/90">
                  {m.name}
                </span>
              </div>
              {m.reply ? (
                <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10.5px] font-medium text-primary-400">
                  <Sparkles className="h-2.5 w-2.5" /> AI replied
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10.5px] font-medium text-success">
                  Lead captured
                </span>
              )}
            </div>
            <p className="mt-1.5 truncate text-[13px] text-muted-foreground">{m.text}</p>
          </motion.div>
        ))}
      </div>

      {/* live stat strip */}
      <div className="relative z-10 grid grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
            className="glass rounded-xl px-3.5 py-3"
          >
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-[17px] font-semibold text-foreground">{s.value}</span>
              <span className="flex items-center gap-0.5 text-[11px] font-medium text-success">
                <TrendingUp className="h-2.5 w-2.5" />
                {s.delta}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 mt-6 flex items-center gap-2 text-[12px] text-muted-foreground">
        <MessageCircle className="h-3.5 w-3.5" />
        Trusted by 2,400+ creators and DTC brands automating Instagram
      </div>
    </div>
  );
}
