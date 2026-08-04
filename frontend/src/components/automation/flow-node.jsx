"use client";

import { useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { NODE_TYPES } from "@/lib/constants/automation-nodes";
import { cn } from "@/lib/utils";

export const NODE_WIDTH = 224;
export const NODE_HEIGHT = 88;

export function FlowNode({ node, selected, onSelect, onDrag, onAddNext, onDelete, canDelete }) {
  const dragRef = useRef(null);

  const def = NODE_TYPES[node.type];
  const Icon = def.icon;

  const handlePointerDown = (e) => {
    e.stopPropagation();
    onSelect(node.id);
    const startX = e.clientX;
    const startY = e.clientY;
    const originX = node.x;
    const originY = node.y;

    const handleMove = (ev) => {
      onDrag(node.id, originX + (ev.clientX - startX), originY + (ev.clientY - startY));
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  return (
    <div
      ref={dragRef}
      style={{ left: node.x, top: node.y, width: NODE_WIDTH }}
      className="absolute select-none"
    >
      <div
        onPointerDown={handlePointerDown}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        className={cn(
          "cursor-grab rounded-2xl border bg-surface-raised p-3.5 shadow-soft transition-colors active:cursor-grabbing",
          selected ? "border-primary/60 ring-2 ring-primary/20" : "border-border hover:border-white/20"
        )}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            style={{ background: `${def.color}22`, color: def.color }}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {def.label}
            </p>
            <p className="truncate text-[13px] font-semibold text-foreground">{node.title}</p>
          </div>
          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.id);
              }}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
        {node.config && (
          <p className="mt-2 truncate rounded-lg bg-white/[0.04] px-2 py-1 text-[11px] text-muted-foreground">
            {node.config}
          </p>
        )}
      </div>

      {node.type !== "end" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddNext(node.id);
          }}
          style={{ left: NODE_WIDTH / 2 - 10 }}
          className="absolute -bottom-[13px] flex h-5 w-5 items-center justify-center rounded-full border border-border bg-surface-sunken text-muted-foreground shadow-soft transition-colors hover:border-primary/60 hover:text-primary-400"
        >
          <Plus className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
