"use client";

import { PALETTE_SECTIONS, NODE_TYPES } from "@/lib/constants/automation-nodes";

export function NodePalette({ onAdd, compact = false }) {
  return (
    <div className={compact ? "w-64" : "w-64 shrink-0 border-r border-border p-4"}>
      {!compact && <p className="mb-3 text-[13px] font-semibold text-foreground">Add a node</p>}
      <div className="space-y-4">
        {PALETTE_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="mb-1.5 px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.types.map((typeKey) => {
                const t = NODE_TYPES[typeKey];
                const Icon = t.icon;
                return (
                  <button
                    key={typeKey}
                    onClick={() => onAdd(typeKey)}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("node-type", typeKey)}
                    className="flex w-full items-center gap-2.5 rounded-xl border border-transparent px-2.5 py-2 text-left transition-colors hover:border-border hover:bg-white/[0.04]"
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${t.color}22`, color: t.color }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-medium text-foreground">{t.label}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{t.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
